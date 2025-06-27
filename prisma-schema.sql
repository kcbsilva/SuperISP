// prisma-schema.sql (Prisma-compatible snippet)

// 1. Define the enum first
enum DeviceType {
  Router
  Switch
  AccessPoint
  NVR
  Server
  OLT
  Other
}

// 2. Define the model
model Device {
  id         String     @id @default(uuid())
  name       String
  ip_address String     @db.Inet
  type       DeviceType
  pop        Pop?       @relation(fields: [popId], references: [id], onDelete: SetNull)
  popId      String?    // optional
  created_at DateTime   @default(now())
  updated_at DateTime   @default(now())

  @@map("devices") // maps to existing SQL table if already created manually
}

model EntryCategory {
  id               String   @id @default(uuid())
  name             String
  type             String   // 'Income' or 'Expense'
  description      String?
  parentCategoryId String?  @map("parent_category_id")
  createdAt        DateTime @default(now())
  
  parentCategory   EntryCategory? @relation("ParentChild", fields: [parentCategoryId], references: [id])
  children         EntryCategory[] @relation("ParentChild")
}