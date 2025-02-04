import prisma from '../lib/prisma.js';

const handleCreateTopic = async ({ amount, topicData, erc20Address }) => {
    try {
        const { topic_id, topic_title, topic_content, image_url, created_at } = topicData;

        const topic = await prisma.topic.create({
            data: {
                content: topic_content,
                totalInvestment: amount, 
                authorId: null,  
                topic_id: topic_id,
                metadata: {
                    create: {
                        topic_title,
                        topic_content,
                        image_url,
                        erc20Address,
                        created_at: new Date(created_at),
                    }
                }
            }
        });

        return topic;
    } catch (error) {
        throw new Error(error.message);
    }
};

export { handleCreateTopic };
