#include <Ultrasonic.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <WiFiManager.h>

// Pinagem do sensor ultrassônico
#define PIN_TRIGGER 16
#define PIN_ECHO 17

// Configurações do Firebase
#define API_KEY "SUA_API_KEY"
#define DATABASE_URL "https://seu-app.firebaseio.com/"

// Constantes
const char* ssid = "CleanTechBin";

// Objetos
Ultrasonic ultrasonic(PIN_TRIGGER, PIN_ECHO);
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
WiFiManager wm;

float distancia = 0;
unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

void setup() {
  WiFi.mode(WIFI_STA);
  Serial.begin(115200);
  wm.setConfigPortalBlocking(false);
  wm.setConfigPortalTimeout(60);
  wm.setConfigPortalBlocking(false);
  wm.setConfigPortalTimeout(60);

  if (wm.autoConnect(ssid)) {
    Serial.println("Conectado com sucesso!");

    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;
    Firebase.reconnectNetwork(true);
    fbdo.setBSSLBufferSize(4096, 1024);

    // Inicialização do Firebase
    if (initializeFirebase()) {
      Serial.println("Firebase inicializado com sucesso!");
      signupOK = true;
    } else {
      Serial.printf("Erro ao inicializar o Firebase: %s\n", config.signer.signupError.message.c_str());
    }
  } else {
    Serial.println("Configportal em execução");
  }
}

void loop() {
  wm.process();

  if (Firebase.ready() && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    long microsec = ultrasonic.timing();
    distancia = ultrasonic.convert(microsec, Ultrasonic::CM);

    // Envia dados para o Firebase
    if (sendDataToFirebase()) {
      Serial.println("Dados enviados com sucesso para o Firebase!");
    } else {
      Serial.printf("Erro ao enviar dados para o Firebase: %s\n", fbdo.errorReason().c_str());
    }
  }
}

bool initializeFirebase() {
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  if (Firebase.signUp(&config, &auth, "", "")) {
    config.token_status_callback = tokenStatusCallback;
    Firebase.begin(&config, &auth);
    return true;
  }
  return false;
}

bool sendDataToFirebase() {
  Serial.printf("Enviando distância: %f cm\n", distancia);
  return Firebase.RTDB.setDouble(&fbdo, "/bins/1/1/distance", distancia) && Firebase.RTDB.setTimestamp(&fbdo, "/bins/1/1/timestamp");
}
