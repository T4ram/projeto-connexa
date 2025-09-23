package java.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.jan.supabase.gotrue.Email
import io.github.jan.supabase.gotrue.signInWith
import java.ui.LoginUiState
import java.supabase.SupabaseProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

// Data class para o estado do login

data class LoginUiState(
    val email: String = "",
    val senha: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val loginSucesso: Boolean = false
)

class LoginViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun onEmailChange(email: String) {
        _uiState.update { it.copy(email = email) }
    }
    fun onSenhaChange(senha: String) {
        _uiState.update { it.copy(senha = senha) }
    }
    fun limparErro() {
        _uiState.update { it.copy(error = null) }
    }

    fun realizarLogin(email: String, senha: String) = viewModelScope.launch {
        _uiState.update { it.copy(isLoading = true, error = null) }
        try {
            SupabaseProvider.client.auth.signInWith(Email) {
                this.email = email
                this.password = senha
            }
            _uiState.update { it.copy(isLoading = false, loginSucesso = true) }
        } catch (e: Exception) {
            _uiState.update { it.copy(isLoading = false, error = e.message) }
        }
    }
}
