package kotlin.models

data class Group(
    val name: String,
    val subject: String,
    val description: String,
    val type: String, // "online" or "presencial"
    val participantCount: Int
)