package java.services

import java.models.Usuario

class UsuarioService(private val usuarioRepository: UsuarioRepository) {
    fun validarEmailInstitucional(email: String): Boolean {
        return email.endsWith("@universidade.com")
    }

    fun validarSenha(senha: String): Boolean {
        val regex = Regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}")
        return regex.matches(senha)
    }

    fun emailJaExiste(email: String): Boolean {
        return usuarioRepository.buscarPorEmail(email) != null
    }

    fun cadastrarUsuario(usuario: Usuario): Result<String> {
        if (!validarEmailInstitucional(usuario.email)) {
            return Result.failure(Exception("O e-mail informado não é um e-mail institucional válido."))
        }
        if (!validarSenha(usuario.senha)) {
            return Result.failure(Exception("A senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra maiúscula, uma minúscula e um número."))
        }
        if (emailJaExiste(usuario.email)) {
            return Result.failure(Exception("O e-mail informado já está cadastrado."))
        }
        usuarioRepository.salvar(usuario)
        return Result.success("Usuário cadastrado com sucesso!")
    }
}

interface UsuarioRepository {
    fun buscarPorEmail(email: String): Usuario?
    fun salvar(usuario: Usuario)
}
