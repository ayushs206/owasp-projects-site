import { timetable } from "../db/timetable.js";
import { generateGoogleAuthURL } from "../services/google.apis.js";

export const getGoogleAuthURL = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ status: "error", message: "Request body is required" });
    }

    const { batch, operation } = req.body;
    if (!operation || (!batch && operation === "addToCalendar")) {
        return res.status(400).json({ status: "error", message: "Invalid body request" });
    }

    if (!["addToCalendar", "resetCalendar"].includes(operation)) {
        return res.status(400).json({ status: "error", message: "Invalid operation. Please provide either 'addToCalendar' or 'resetCalendar'" });
    }

    if (operation === "addToCalendar" && !timetable[batch.toUpperCase()]) {
        return res.status(404).json({ status: "error", message: "Batch not found" });
    }

    try {
        const url = await generateGoogleAuthURL(batch ? batch.toUpperCase() : "ALL", operation);
        if (url) {
            res.status(200).json({ status: "success", data: url });
        }
    } catch (error) {
        console.error("Error generating Google Auth URL:", error);
        res.status(500).json({ status: "error", message: "Failed to generate Google Auth URL" });
    }
}

import { handleGoogleCallback } from "../services/google.apis.js";

export const googleAuthCallback = async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ status: "error", message: "Query parameters are required" });
    }

    const { code, state, error } = req.query;
    const frontendUrl = process.env.TIMETABLE_FRONTEND_URL || "http://localhost:3000";

    if (error) {
        console.error("Google Auth Error:", error);
        return res.redirect(`${frontendUrl}/calendar?result=fail`);
    }

    if (!code || !state) {
        return res.redirect(`${frontendUrl}/calendar?result=fail`);
    }

    try {
        const decodedState = JSON.parse(state);
        if (!decodedState || !decodedState.batch || !decodedState.operation) {
            return res.redirect(`${frontendUrl}/calendar?result=fail`);
        }
        const { batch, operation } = decodedState;

        await handleGoogleCallback(code, batch, operation);

        res.redirect(`${frontendUrl}/calendar?result=success`);
    } catch (err) {
        console.error("Error handling Google callback:", err);
        res.redirect(`${frontendUrl}/calendar?result=fail`);
    }
}