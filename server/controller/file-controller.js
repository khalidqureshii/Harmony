import XLSX from "xlsx";
import User from "../models/user-model.js";

export async function uploadFile(req, res) {
    try {
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        for (const row of sheetData) {
            const existingUser = await User.findOne({
                $or: [{ username: row.Username }, { email: row.Email }],
            });

            if (existingUser) {
                console.log(`Duplicate entry found: ${row.Username} or ${row.Email}`);
                continue; 
            }

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
