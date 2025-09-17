package kotlin.routes

import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.registerChatRoutes() {
    route("/chat") {
        get {
            // Chat functionality will be implemented here
        }
    }
}