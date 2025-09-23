package java.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp

// Defina um UiState de exemplo para o formulário

data class CadastroUiState(
    val nome: String = "",
    val email: String = "",
    val curso: String = "",
    val semestre: String = "",
    val senha: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val cadastroSucesso: Boolean = false
)

@Composable
fun TelaDeCadastro(
    uiState: CadastroUiState,
    onNomeChange: (String) -> Unit,
    onEmailChange: (String) -> Unit,
    onCursoChange: (String) -> Unit,
    onSemestreChange: (String) -> Unit,
    onSenhaChange: (String) -> Unit,
    onCadastrarClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center
    ) {
        TextField(
            value = uiState.nome,
            onValueChange = onNomeChange,
            label = { Text("Nome completo") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(12.dp))
        TextField(
            value = uiState.email,
            onValueChange = onEmailChange,
            label = { Text("E-mail institucional") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(12.dp))
        TextField(
            value = uiState.curso,
            onValueChange = onCursoChange,
            label = { Text("Curso") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(12.dp))
        TextField(
            value = uiState.semestre,
            onValueChange = onSemestreChange,
            label = { Text("Período/Semestre") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(12.dp))
        TextField(
            value = uiState.senha,
            onValueChange = onSenhaChange,
            label = { Text("Senha") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(20.dp))
        Button(
            onClick = onCadastrarClick,
            modifier = Modifier.fillMaxWidth(),
            enabled = !uiState.isLoading
        ) {
            Text("Cadastrar")
        }
        uiState.errorMessage?.let {
            Spacer(modifier = Modifier.height(16.dp))
            Text(text = it, color = MaterialTheme.colorScheme.error)
        }
    }
}
