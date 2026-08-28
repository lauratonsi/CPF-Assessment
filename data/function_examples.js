/* Step 2 — esempi compilati di definizione di funzione cyber-fisica (§3.2).
   Non sono modelli da copiare: mostrano il livello di dettaglio atteso in
   ogni campo e come la scelta di criticità (1-4) si àncora ai criteri CER.
   Popola window.CPF.data.functionExamples */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.functionExamples = [
    {
      id: "potabilizzazione",
      title: "Potabilizzazione — linea A",
      sector_hint: "Acqua potabile · NIS2 + CER",
      name: "Potabilizzazione — linea A",
      service_description: "Erogazione continua di acqua potabile conforme ai parametri di legge a circa 45.000 abitazioni e a due strutture ospedaliere del bacino nord. La linea A copre da sola il 60% della portata cittadina nelle ore di punta.",
      physical_process: "Filtrazione, dosaggio del disinfettante e controllo di torbidità e cloro residuo su una linea di trattamento da 320 l/s; il PLC di linea regola pompe di dosaggio e valvole di sezionamento. Stato sicuro = chiusura della linea e commutazione sul serbatoio di compenso.",
      perimeter: "Impianto di trattamento, SCADA di stabilimento, rete di telecontrollo dei serbatoi e delle stazioni di rilancio di proprietà. Fuori perimetro: rete di distribuzione a valle del serbatoio cittadino (altro gestore) e fornitura elettrica di media tensione.",
      criticality: 3,
      criticality_rationale: "Ampio numero di utenti dipendenti e presenza di utenze sensibili (ospedali); l'interruzione avrebbe impatto esteso e prolungato sul bacino nord. Esiste un'alternativa parziale (linea B + autobotti) ma la sua attivazione richiede diverse ore e non copre la punta. Nessuna conseguenza diretta su sicurezza pubblica o ambiente in caso di sola interruzione."
    },
    {
      id: "regolazione_gas",
      title: "Regolazione di pressione — cabina di primo salto",
      sector_hint: "Distribuzione gas · CER + NIS2",
      name: "Regolazione di pressione — cabina di primo salto (REMI)",
      service_description: "Riduzione e stabilizzazione della pressione del gas dalla rete di trasporto nazionale alla rete di distribuzione cittadina, per l'intera area urbana servita (unico punto di consegna).",
      physical_process: "Regolatori di pressione in configurazione monitor+servizio, con blocco automatico di sovra/sottopressione e odorizzazione a valle. Il sistema di telecontrollo acquisisce pressioni e portate e comanda le valvole motorizzate. Stato sicuro = intervento del blocco meccanico indipendente dal telecontrollo.",
      perimeter: "Cabina REMI, telecontrollo di cabina e collegamento verso la sala di dispacciamento; procedure di intervento manuale in loco. Fuori perimetro: rete di trasporto a monte (gestore nazionale) e utenze finali.",
      criticality: 4,
      criticality_rationale: "Servizio essenziale senza alternative praticabili nei tempi rilevanti: è l'unico punto di consegna per l'area urbana. Una perdita di controllo della pressione può propagarsi all'intera rete di distribuzione con rischio per l'incolumità pubblica (sovrapressione alle utenze) e richiede giorni per il ripristino completo con riaccensione porta a porta. Forte dipendenza intersettoriale da energia elettrica e telecomunicazioni."
    },
    {
      id: "controllo_sicurezza_linea",
      title: "Controllo di sicurezza — linea di imbottigliamento",
      sector_hint: "Manifattura · Reg. Macchine + AI Act + CRA",
      name: "Controllo di sicurezza — linea di imbottigliamento L3",
      service_description: "Mantenimento delle condizioni di sicurezza per gli operatori sulla linea di imbottigliamento L3 (nastri, riempitrice, capsulatrice, pallettizzatore) durante la produzione e gli interventi di manutenzione.",
      physical_process: "Sistema strumentato di sicurezza (arresti di emergenza, barriere immateriali, interblocchi di ripari mobili) più un modulo di visione basato su machine learning che rileva la presenza di persone in aree pericolose e propone il rallentamento o l'arresto. Stato sicuro = arresto controllato con energia rimossa dagli attuatori.",
      perimeter: "Linea L3, PLC di sicurezza, modulo di visione e relativa rete di campo, accesso di manutenzione remota del fornitore. Fuori perimetro: MES di stabilimento e rete IT aziendale.",
      criticality: 2,
      criticality_rationale: "L'interruzione della sola linea L3 ha impatto produttivo circoscritto e ricollocabile su altre linee; non vi sono utenti esterni né dipendenze intersettoriali. La criticità non è più bassa perché una manipolazione del modulo di visione o del SIS inciderebbe direttamente sull'incolumità degli operatori: la conseguenza è grave anche se l'estensione è limitata."
    }
  ];
})(window);
