import { handleCreateTopic } from '../../../controllers/topicController.js';
import apiResponse from '../../../utils/apiResponse.js';
import apiError from '../../../utils/apiError.js';

export default async function createTopicHandler(req, res) {
  if (req.method === 'POST') {
    try {
      const { content, totalInvestment, authorId } = req.body;
      await handleCreateTopic({ content, totalInvestment, authorId });
      res.status(200).json(
        new apiResponse(
            200,
            { message: 'Topic created successfully' },
            'Topic created'
        )
      );
    } catch (error) {
      console.error('Error in createTopicHandler:', error);
      res.status(500).json(
        new apiError(
          500,
          error.message
        )
      );
    }
  } else {
    res.status(405).json(
        new apiError(
            405,
            'Method not allowed'
        )
    );
  }
}
