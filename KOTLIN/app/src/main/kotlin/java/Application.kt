package kotlin

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import kotlin.routes.registerGroupRoutes
import kotlin.routes.registerChatRoutes

fun main() {
    embeddedServer(Netty, port = 8080) {
        routing {
            registerGroupRoutes()
            registerChatRoutes()
        }
    }.start(wait = true)
}