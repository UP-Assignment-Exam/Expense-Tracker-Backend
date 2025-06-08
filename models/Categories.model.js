const { db, mongoose } = require("./settings/connection")

const CategorySchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, // null means it's a default (global) category
        },
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            default: '', // optional icon like '🍔' or '💼'
        },
        type: {
            type: String,
            enum: ["income", "expense"],
            default: "expense",
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
)

module.exports = db.model("categories", CategorySchema)
