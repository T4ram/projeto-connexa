// Em um novo arquivo, por exemplo: app/src/main/kotlin/java/routes/UserRoutes.kt

package java.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.models.User // Supondo a existência de um modelo de dados User

// Data class para representar o corpo da requisição de cadastro
data class CadastroRequest(
    val nomeCompleto: String,
    val email: String,
    val curso: String,
    val semestre: Int,
    val senha: String
)

fun Route.userRouting() {
    route("/api/usuarios") {
        post("/cadastro") {
            val request = call.receive<CadastroRequest>()

            // ✅ Validação do domínio do e-mail institucional
            if (!request.email.endsWith("@dominio.universidade.edu.br")) {
                return@post call.respond(HttpStatusCode.BadRequest, "O e-mail informado não é um e-mail institucional válido.")
            }

            // ✅ Validação da complexidade da senha
            val senhaRegex = Regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}\$")
            if (!senhaRegex.matches(request.senha)) {
                return@post call.respond(HttpStatusCode.BadRequest, "A senha deve ter no mínimo 8 caracteres, com uma letra maiúscula, uma minúscula e um número.")
            }

            // ✅ Validação de e-mail já existente (exemplo com uma lista mockada)
            // TODO: Substituir pela verificação no banco de dados
            val emailExistente = false // userService.findByEmail(request.email) != null
            if (emailExistente) {
                return@post call.respond(HttpStatusCode.BadRequest, "O e-mail informado já está cadastrado.")
            }
            
            // TODO: Implementar a lógica para salvar o novo usuário no banco de dados.
            // val newUser = User(...)
            // userService.create(newUser)

            // TODO: Implementar o envio do e-mail de confirmação.
            
            // ✅ Retorno 201 Created em caso de sucesso
            call.respond(HttpStatusCode.Created, "Usuário cadastrado com sucesso!")
        }
    }
}