package java.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import java.ui.CadastroUiState
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.supabase.SupabaseProvider
import io.github.jan.supabase.gotrue.Auth
import io.github.jan.supabase.gotrue.signUpWith
import io.github.jan.supabase.gotrue.providers.Email
import io.github.jan.supabase.gotrue.user.UserInfo
import io.github.jan.supabase.json.jsonObjectOf
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class CadastroViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(CadastroUiState())
    val uiState: StateFlow<CadastroUiState> = _uiState.asStateFlow()

    fun onNomeChange(nome: String) {
        _uiState.update { it.copy(nome = nome) }
    }
    fun onEmailChange(email: String) {
        _uiState.update { it.copy(email = email) }
    }
    fun onCursoChange(curso: String) {
        _uiState.update { it.copy(curso = curso) }
    }
    fun onSemestreChange(semestre: String) {
        _uiState.update { it.copy(semestre = semestre) }
    }
    fun onSenhaChange(senha: String) {
        _uiState.update { it.copy(senha = senha) }
    }

    fun limparErro() {
        _uiState.update { it.copy(error = null) }
    }

    fun realizarCadastro() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val state = _uiState.value
                SupabaseProvider.client.auth.signUpWith(Email) {
                    email = state.email
                    password = state.senha
                    data = jsonObjectOf(
                        "nomeCompleto" to state.nome,
                        "curso" to state.curso,
                        "semestre" to state.semestre
                    )
                }
                _uiState.update { it.copy(isLoading = false, cadastroSucesso = true) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            }
        }
    }
}
