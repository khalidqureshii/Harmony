import XLSX from "xlsx";
import User from "../models/user-model.js";

export async function uploadFile(req, res) {
    try {
        const filePath = req.file.path;

        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        for (const row of sheetData) {
            const user = new User({
                username: row.Username, 
                email: row.Email,
                password: row.Password, 
                isAdmin: false,
            });
            await user.save();
        }

        res.status(200).json({ message: 'Data imported successfully!' });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error importing data', error: err.message });
    }
}