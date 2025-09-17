package kotlin.routes

import io.ktor.server.application.*
import io.ktor.server.html.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.html.*
import kotlin.models.Group
import kotlin.services.GroupService

val groupService = GroupService()

fun Route.registerGroupRoutes() {
    route("/groups") {
        get("/create") {
            call.respondHtml {
                body {
                    h1 { +"Criar Grupo" }
                    form(action = "/groups/create", method = FormMethod.post) {
                        textInput { name = "name"; placeholder = "Nome do Grupo" }
                        textInput { name = "subject"; placeholder = "Matéria" }
                        textInput { name = "description"; placeholder = "Descrição" }
                        select { name = "type" 
                            option { +"online" }
                            option { +"presencial" }
                        }
                        numberInput { name = "participantCount"; placeholder = "Número de Participantes" }
                        submitInput { value = "Criar Grupo" }
                    }
                }
            }
        }

        post("/create") {
            val params = call.receiveParameters()
            val group = Group(
                name = params["name"] ?: "",
                subject = params["subject"] ?: "",
                description = params["description"] ?: "",
                type = params["type"] ?: "",
                participantCount = params["participantCount"]?.toIntOrNull() ?: 0
            )
            val result = groupService.createGroup(group)
            call.respondText(result)
        }

        get("/{name}") {
            val name = call.parameters["name"] ?: ""
            val group = groupService.getGroupByName(name)
            if (group != null) {
                call.respondHtml {
                    body {
                        h1 { +"Detalhes do Grupo" }
                        p { +"Nome: ${group.name}" }
                        p { +"Matéria: ${group.subject}" }
                        p { +"Descrição: ${group.description}" }
                        p { +"Tipo: ${group.type}" }
                        p { +"Número de Participantes: ${group.participantCount}" }
                    }
                }
            } else {
                call.respondText("Grupo não encontrado.")
            }
        }
    }
}