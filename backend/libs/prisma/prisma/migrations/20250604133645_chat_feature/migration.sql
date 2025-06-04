-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "initiator_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
