package java.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import java.viewmodel.LoginViewModel

@Composable
fun TelaDeLoginScreen(
    onLoginSucesso: () -> Unit,
    onNavigateToCadastro: () -> Unit
) {
    val viewModel: LoginViewModel = viewModel()
    val uiState by viewModel.uiState.collectAsState()

    if (uiState.loginSucesso) {
        onLoginSucesso()
    }

    TelaDeLogin(
        uiState = uiState,
        onEmailChange = viewModel::onEmailChange,
        onSenhaChange = viewModel::onSenhaChange,
        onEntrarClick = {
            viewModel.realizarLogin(uiState.email, uiState.senha)
        }
    )
    // Adicione um botão ou link para cadastro, se desejar:
    // Button(onClick = onNavigateToCadastro) { Text("Cadastre-se") }
}
