import { Request, Response } from "express";
import admin from "firebase-admin";
import serviceAccount from "~/social-meme-flutter-firebase-adminsdk.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "social-meme-flutter.appspot.com",
});

export const uploadPostController = async (req: Request, res: Response) => {
  if (!req.files) {
    return res.status(400).send("no file");
  }

  if (req.files !== undefined) {
    req.files = req.files as Array<Express.Multer.File>;

    const fileFirst: Express.Multer.File = req.files[0];
    const bucket = admin.storage().bucket();
    const fileGet = bucket.file("post_images/teo.PNG");

    return res.status(200).json({ messag: "testing" });
    // const storageRef = ref(storage, `files/${req.file.originalname }       ${dateTime}`);
    // Now you can use the 'file' object safely
  } else {
    // Handle the case when req.files is undefined or empty
  }
};

// console.log(fileFirst.originalname)
// console.log(fileFirst.mimetype)
