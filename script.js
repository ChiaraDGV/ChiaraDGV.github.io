jQuery(document).ready(function() { //caricamento dati dopo caricamento DOM
    let conteggioErrori = 0;
    let conteggioTentativi = 0;
  
    //animazione iniziale
    jQuery('.welcome').show(2000); //mostra blocco di benvenuto
  
    //click event sui bottoni
    jQuery('.go-to-domande').on('click', function() { //click event su bottone start
      jQuery('.welcome').hide("slow"); //nascondi blocco di benvenuto
      jQuery('.wrapper-domande').show("slow"); //mostra blocco domande
      prossimaDomanda();
      timer();
      conteggioTentativi++; //aumento conteggio tentativi
      console.log(conteggioTentativi); //debug
    });
  
    jQuery('.rispondi').on('click', function() { //click event su bottone invia risposta
  
      let yes = jQuery(this).closest('.singola-domanda').find('input.yes'); //risposta/e corretta/e
      let nope = jQuery(this).closest('.singola-domanda').find('input.nope'); //rispos/e sbagliata/e
      let errori = false; //la risposta è corretta
      console.log(yes); //debug	
  
      yes.each(function() { //se la risposta è corretta
        if (!jQuery(this).is(':checked')) { //ed è stata selezionata 
          errori = true; //c'è un'errore
        }
      });
  
      nope.each(function() { //se la risposta è corretta
        if (jQuery(this).is(':checked')) { //ed è stata selezionata 
          errori = true; //c'è un'errore
        }
      });
  
      if (errori == true) {
        conteggioErrori++; //aumento conteggio errori
        jQuery(this).closest('.singola-domanda').addClass('no-ok risposta-data'); //risposta errata e domanda non riproposta
      } else {
        jQuery(this).closest('.singola-domanda').addClass('ok risposta-data'); //risposta corretta e domanda non riproposta
      }
  
      window.conteggioDomande++; //aumento conteggio domande
  
      console.log(window.conteggioDomande); //debug
      console.log(conteggioErrori); //debug
      if (window.conteggioDomande >= 3) { //conta le risposte date
  
        if (conteggioErrori > 1) { //controlla gli errori
          jQuery('.wrapper-domande').hide("slow"); //nasconde il blocco domande
  
          if (conteggioTentativi == 2) { //controlla i tentativi
            jQuery('.negativo').hide(); //nascondi il blocco del feedback negativo
            jQuery('.fallito').show("slow"); //mostra feedback test fallito
          } else {
            jQuery('.negativo').show("slow"); //mostra feedback negativo                    
          }
        } else {
          jQuery('.wrapper-domande').hide("slow"); //nasconde il blocco domande
          jQuery('.positivo').show("slow"); //mostra feedback positivo
        }
        let domandeCorrette = window.conteggioDomande - conteggioErrori; //numero di risposte corrette
        let percentualeCorrette = Math.round(100 * domandeCorrette / window.conteggioDomande); //percentuale di risposte corrette
        let percentualeSbagliate = Math.round(100 * conteggioErrori / window.conteggioDomande); //percentuale di risposte sbagliate
        clearInterval(window.questionTimer);
        jQuery('.singola-domanda').hide("slow");
        jQuery('#timer').hide("slow");
        jQuery('.corrette').html('<b>' + domandeCorrette + '</b>');
        jQuery('.sbagliate').html('<b>' + conteggioErrori + '</b>');
        jQuery('.percentuale-corrette').html('<b>' + percentualeCorrette + '</b>%');
        jQuery('.percentuale-errate').html('<b>' + percentualeSbagliate + '</b>%');
      } else {
        prossimaDomanda();
        timer();
      }
  
    }); //click invia risposta
  
    //ritenta
    jQuery('.ritenta').on('click',
      function() { //click event su bottone riprova
        jQuery('.negativo').hide("slow"); //nascondi blocco feedback negativo
        window.conteggioDomande = 0; //resetta il conteggio delle domande            
        conteggioErrori = 0; //resetta il conteggio errori
        conteggioTentativi++; //resetta il conteggio dei tentativi
        /* toglie il check su domande e risposte; 
        si può omettere se si vogliono escludere domande già fatte e non si vuole riproporle al secondo tentativo */
        jQuery('.singola-domanda').removeClass('no-ok ok risposta-data');
        jQuery('.wrapper-domande').show("slow"); //mostra il blocco delle domande
        jQuery('#timer').show("slow"); //mostro il blocco del timer
        prossimaDomanda();
        timer();
        console.log('stai riprovando'); //debug
      });
  
  }); //documentReady
  
  window.timeleft = 10;
  window.questionTimer = 0;
  window.conteggioDomande = 0;
  //countdown
  let timer = function() {
  
    clearInterval(window.questionTimer);
    window.timeleft = 10;
    jQuery('#timer').html(window.timeleft);
    window.questionTimer = setInterval(function() {
      window.timeleft -= 1;
      if (timeleft <= 0) {
        clearInterval(window.questionTimer);
        jQuery('#timer').html('Tempo Scaduto');
        jQuery("#timer").removeClass('timer-running').addClass('timer-finished');
        jQuery('.domanda-corrente').find('input').prop('checked', false);
        if (window.conteggioDomande < 3) {
          alert('Tempo Scaduto. Ora passerai alla prossima domanda.');
        }
        jQuery('.domanda-corrente').find('.rispondi').trigger('click');
        jQuery("#timer").removeClass('timer-finished').addClass('timer-running');
        //TODO: qui dentro, popup messaggio prossima domanda        
      } else {
        jQuery("#timer").html(window.timeleft);
      }
    }, 1000);
  
  }
  
  let prossimaDomanda = function() { //blocco variabili e richiami domande
    let domandeSenzaRisposta = jQuery('.wrapper-domande').find('.singola-domanda').not('.risposta-data'); //numero di possibili domande senza risposta
    let numeroDiDomandeSenzaRisposta = domandeSenzaRisposta.length; //numero di domande senza risposta
    let domandaRandom = Math.floor(Math.random() * numeroDiDomandeSenzaRisposta); //selezione di una domanda random                
    jQuery('.singola-domanda').hide().removeClass('domanda-corrente'); //nascondi domanda dopo risposta
    jQuery(domandeSenzaRisposta[domandaRandom]).show().addClass('domanda-corrente'); //mostra domanda random successiva
  }