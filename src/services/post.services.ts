import Post from '~/models/schemas/Post.schemas'
import databaseServices from './database.services'

class postServices {
  constructor() {}
  async uploadPost(payload: Post) {
    const result = await databaseServices.posts.insertOne(payload)
    return result
  }
}
export default new postServices()
