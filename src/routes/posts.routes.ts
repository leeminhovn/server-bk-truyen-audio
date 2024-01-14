import { Router } from 'express'
import { uploadPostController } from '~/controllers/posts.controllers'
import { authMiddeware } from '~/middelwares/auth.middleware'
import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage()
})

// Setting up multer as a middleware to grab photo uploads

const postRotuer = Router()

postRotuer.post('/upload-post', authMiddeware, upload.array('files', 500), uploadPostController)

export default postRotuer
