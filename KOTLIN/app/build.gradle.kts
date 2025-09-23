plugins {
    kotlin("jvm") version "1.9.10"
    id("io.ktor.plugin") version "2.3.4"
    id("com.android.application") version "8.4.1" apply false // Versão recomendada
    id("org.jetbrains.kotlin.android") version "1.9.23" apply false // Versão recomendada
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core:2.3.4")
    implementation("io.ktor:ktor-server-netty:2.3.4")
    implementation("io.ktor:ktor-server-html-builder:2.3.4")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.4")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.4")
    testImplementation("io.ktor:ktor-server-tests:2.3.4")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.3") // Verifique a versão mais recente
}

tasks.test {
    useJUnitPlatform()
}
