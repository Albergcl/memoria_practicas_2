import { Db, ObjectId } from 'mongodb';

export const getOrCreateForum = async (db: Db, movieId: string) => {
    const forumsCollection = db.collection("forums");

    let forum = await forumsCollection.findOne({ movieId: new ObjectId(movieId) });

    if (!forum) {
        const newForum = {
            movieId: new ObjectId(movieId),
            messages: [],
            createdAt: new Date()
        };

        const result = await forumsCollection.insertOne(newForum);
        forum = {
            _id: result.insertedId,
            ...newForum
        };
    }

    return forum;
};

export const addMessageToForum = async (db: Db, movieId: string, userId: string, username: string, text: string) => {
    const forumsCollection = db.collection("forums");

    const message = {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        username,
        text,
        createdAt: new Date()
    };

    await forumsCollection.updateOne(
        { movieId: new ObjectId(movieId) },
        { $push: { messages: message } as any}
    );

    return message;
}

export const getForumByMovie = async (db: Db, movieId: string) => {
    const forumsCollection = db.collection("forums");

    const forum = await forumsCollection.findOne({ movieId: new ObjectId(movieId) });

    if (!forum) return null;

    // Ordenar los mensajes por fecha de creación (de más reciente a más antiguo)
    forum.messages.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return forum;
};