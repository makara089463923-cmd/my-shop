-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'cod',
ADD COLUMN     "paymentProof" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
ADD COLUMN     "trackingHistory" JSONB DEFAULT '[]';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
