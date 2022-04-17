function start() { 

	$("#start").hide();
	
	$("#background").append("<div class='anima1' id='jogador'></div>");
	$("#background").append("<div class='anima2' id='inimigo1'></div>");
	$("#background").append("<div id='inimigo2'></div>");
	$("#background").append("<div class='anima3' id='amigo'></div>");
    $("#background").append("<div id='placar'></div>");
    $("#background").append("<div id='energia'></div>");

    var jogo = {}
    var TECLA = {
        UP: 38,
        DOWN: 40,
        SPACE: 32
    }

    var pontos=0;
    var salvos=0;
    var perdidos=0;
    var velocidade=5;
    var posicaoY = parseInt(Math.random() * 334);
    var energiaAtual=3;

    var podeAtirar=true;
    var fimdejogo=false;

    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    jogo.timer = setInterval(loop,30);
    jogo.pressionou = [];

    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });


    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    function loop() {
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    } 
    
    function movefundo() {
        esquerda = parseInt($("#background").css("background-position"));
        $("#background").css("background-position",esquerda-1);
    }

    function movejogador() {
	
        if (jogo.pressionou[TECLA.UP]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo-10);
            if (topo<=0) {
                $("#jogador").css("top",topo+10);
            }
        }
        
        if (jogo.pressionou[TECLA.DOWN]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo+10);	
            if (topo>=434) {	
                $("#jogador").css("top",topo-10);       
            }
        }
        
        if (jogo.pressionou[TECLA.SPACE]) {
            disparo();	
        }
    
    }

    function moveinimigo1() {

        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX-velocidade);
        $("#inimigo1").css("top",posicaoY);
            
        if (posicaoX<=0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }
    }

    function moveinimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
	    $("#inimigo2").css("left",posicaoX-3);
				
		if (posicaoX<=0) {
			
		$("#inimigo2").css("left",775);
					
		}
    }

    function moveamigo() {
	
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+1);
                    
        if (posicaoX>906) {
            
            $("#amigo").css("left",0);
                    
        }
    
    }

    function disparo() {
	
        if (podeAtirar==true) {

            somDisparo.play();
            
            podeAtirar=false;
            
            topo = parseInt($("#jogador").css("top"))
            posicaoX= parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro=topo+37;
            $("#background").append("<div id='disparo'></div");
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);
            
            var tempoDisparo=window.setInterval(executaDisparo, 30);
        
        } 
     
        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX+15); 
    
            if (posicaoX>900) {
                            
                window.clearInterval(tempoDisparo);
                tempoDisparo=null;
                $("#disparo").remove();
                podeAtirar=true;
                        
            }
        } 
    }

    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
            
        if (colisao1.length>0) {
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
        
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }

        if (colisao2.length>0) {
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);
                    
            $("#inimigo2").remove();
                
            reposicionaInimigo2();
                
        }	

        if (colisao3.length>0) {
            velocidade=velocidade+0.3;
            pontos=pontos+100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
                
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950);
                
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
                
        }

        if (colisao4.length>0) {
            pontos=pontos+50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
        
            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950);
            
            reposicionaInimigo2();
                
        }

        if (colisao5.length>0) {
            somResgate.play();
            salvos++;
            reposicionaAmigo();
            $("#amigo").remove();
        }

        if (colisao6.length>0) {
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
                    
            reposicionaAmigo();
                    
        }
    
    } 

    function explosao1(inimigo1X,inimigo1Y) {
        somExplosao.play();
        $("#background").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div=$("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao=window.setInterval(removeExplosao, 1000);
        
        function removeExplosao() {
            
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao=null;
            
        }
            
    }

    function explosao2(inimigo2X,inimigo2Y) {
        somExplosao.play();
        $("#background").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2=$("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
        
            function removeExplosao2() {
                
                div2.remove();
                window.clearInterval(tempoExplosao2);
                tempoExplosao2=null;
                
            }
            
            
    }

    function explosao3(amigoX,amigoY) {
        somPerdido.play();
        $("#background").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3=null;
                
        }
        
    }

    function reposicionaInimigo2() {
	
        var tempoColisao4=window.setInterval(reposiciona4, 5000);
            
        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4=null;
            
            if (fimdejogo==false) {
            
                $("#background").append("<div id=inimigo2></div");
            
            }
            
        }	
    
    }
    
    function reposicionaAmigo() {
	
        var tempoAmigo=window.setInterval(reposiciona6, 6000);
        
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;
            
            if (fimdejogo==false) {
            
                $("#background").append("<div id='amigo' class='anima3'></div>");
            
            }
            
        }
    }

    function placar() {
	
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
        
    }

    function energia() {
	
		if (energiaAtual==3) {
			
			$("#energia").css("background-image", "url(imgs/energia3.png)");
		}
	
		if (energiaAtual==2) {
			
			$("#energia").css("background-image", "url(imgs/energia2.png)");
		}
	
		if (energiaAtual==1) {
			
			$("#energia").css("background-image", "url(imgs/energia1.png)");
		}
	
		if (energiaAtual==0) {
			
			$("#energia").css("background-image", "url(imgs/energia0.png)");
			
			gameOver();

		}
	
	}

    function gameOver() {
        fimdejogo=true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#background").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
    }

    
    

}

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
    
}