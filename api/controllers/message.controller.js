import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const { text, imageUrl } = req.body;
  console.log(req.body);

  if (!text && !imageUrl) {
    return res
      .status(400)
      .json({ message: "Message must contain text or image." });
  }

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIDs: {
          has: tokenUserId,
        },
      },
    });

    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found or user not part of chat." });
    }

    const message = await prisma.message.create({
      data: {
        text: text || null,
        imageUrl: imageUrl || null,
        chatId,
        userId: tokenUserId,
      },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
        lastMessage: text || "📷 Image", // image fallback
      },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({ message: "Failed to add message." });
  }
};

// export const addMessage = async (req, res) => {
//   const tokenUserId = req.userId;
//   const chatId = req.params.chatId;
//   const text = req.body.text;

//   try {
//     const chat = await prisma.chat.findUnique({
//       where: {
//         id: chatId,
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//       },
//     });

//     if (!chat) return res.status(404).json({ message: "Chat not found!" });

//     const message = await prisma.message.create({
//       data: {
//         text,
//         chatId,
//         userId: tokenUserId,
//       },
//     });

//     await prisma.chat.update({
//       where: {
//         id: chatId,
//       },
//       data: {
//         seenBy: [tokenUserId],
//         lastMessage: text,
//       },
//     });

//     res.status(200).json(message);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to add message!" });
//   }
// };
