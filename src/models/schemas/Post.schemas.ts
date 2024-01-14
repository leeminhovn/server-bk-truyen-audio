import { ObjectId } from 'mongodb'

enum TypePostUpload {
  ImagePost,
  TextPost
}
interface PostType {
  _id?: ObjectId
  title?: string
  typePost: TypePostUpload
  created_at?: Date
  updated_at?: Date
  image_file?: Array<Buffer>
  text_content?: string
  like_count?: number
  comment_count?: number
}
class Post {
  _id?: ObjectId
  title: string
  typePost: TypePostUpload
  created_at?: Date
  updated_at?: Date
  image_file?: Array<Buffer>
  text_content?: string
  like_count?: number
  comment_count?: number

  constructor(post: PostType) {
    const dataNow = new Date()
    this._id = post._id
    this.title = post.title || ''
    this.typePost = TypePostUpload.ImagePost
    this.image_file = post.image_file || []
    this.comment_count = post.comment_count || 0
    this.like_count = post.like_count
    this.text_content = post.text_content
    this.updated_at = post.updated_at || dataNow
    this.created_at = post.created_at || dataNow
  }
}

export default Post
