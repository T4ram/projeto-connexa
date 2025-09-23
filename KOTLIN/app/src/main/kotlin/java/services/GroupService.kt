package kotlin.services

import kotlin.models.Group

class GroupService {
    private val groups = mutableListOf<Group>()
    // Simulação: cada grupo tem lista de participantes (emails)
    private val groupParticipants = mutableMapOf<String, MutableList<String>>() // groupName -> [emails]

    fun addUserToGroup(groupName: String, email: String) {
        groupParticipants.getOrPut(groupName) { mutableListOf() }.add(email)
    }

    fun getGroupsByUser(email: String): List<Group> {
        val groupNames = groupParticipants.filter { it.value.contains(email) }.map { it.key }
        return groups.filter { groupNames.contains(it.name) }
    }

    fun createGroup(group: Group): String {
        if (groups.any { it.name == group.name }) {
            return "Erro: O nome do grupo já existe."
        }
        if (group.participantCount !in 2..30) {
            return "Erro: O número de participantes deve estar entre 2 e 30."
        }
        groups.add(group)
        return "Grupo criado com sucesso!"
    }

    fun getGroupByName(name: String): Group? {
        return groups.find { it.name == name }
    }

    fun getAllGroups(): List<Group> {
        return groups
    }
}