var Aes, VKCrypt, _gaq;
(function(){
  "use strict";
    
    var GA_SRC = 'https://google-analytics.com/ga.js',
        KEY_NAME = 'vkcrypt-key',
        D               = 68,
        E               = 69,
        S               = 83;    
    if(!_gaq)
        loadScript(GA_SRC, ga);
        

    document.addEventListener('keydown', keyListener, false);
    
    function keyListener(){
        if(event.altKey)
            switch(event.keyCode){
                case D:
                    VKCrypt.decrypt();
                    event.preventDefault();
                    break;
                case E:
                    VKCrypt.encrypt();
                    event.preventDefault();
                    break;                    
                case S:
                    VKCrypt.setKey();
                    event.preventDefault();
                    break;
            }        
    }
    
    
    VKCrypt = {};
    
    function getKey(){
        var lKey = localStorage.getItem(KEY_NAME);
        
        return lKey;
    }
    
    function getMsgElement(){
        var lMsgElement = getByClass('im_editable')[0];
            
        if(!lMsgElement)
            lMsgElement = getByClass('im_editable')[1];
        
        if(!lMsgElement)    
            lMsgElement = getById('mail_box_text');
        
        return lMsgElement;
    }
    
    function setMsgText(pMsgElement, pMsgText){
        var lText   = pMsgElement.textContent,
            lValue  = pMsgElement.value;
        
        if(lText)
            pMsgElement.textContent = pMsgText;
        else if (lValue)
            pMsgElement.value = pMsgText;
    }
      
    VKCrypt.encrypt         = function(){        
        var lSelected   = getByClass('im_sel_row');
            
        /* если выбраны сообщения собеседника */
        if(lSelected.length)
            cryptSelected(lSelected, true);
        else{
            var lMsgElement = getMsgElement(),
                lKey        = getKey() || VKCrypt.setKey(),
                lMsg        = lMsgElement.textContent || lMsgElement.value,            
                lMsgCrypt   = Aes.Ctr.encrypt(lMsg, lKey, 256);                
            
            setMsgText(lMsgElement, lMsgCrypt);            
        }
    };
    
    VKCrypt.decrypt        = function(){
        var lSelected       = getByClass('im_sel_row');
        
        if(lSelected.length)
            cryptSelected(lSelected, false);
        else{
            var lMsgElement = getMsgElement(),
                lKey        = getKey() || VKCrypt.setKey(),
                lMsg        = lMsgElement.textContent || lMsgElement.value,
                lMsgCrypt   = Aes.Ctr.decrypt(lMsg, lKey, 256);
                
            setMsgText(lMsgElement, lMsgCrypt);
        }
    };
    
    VKCrypt.setKey     = function(){
        var lKeyWas = getKey(),
            lKey    = prompt('Ключ: ', lKeyWas || '') || lKeyWas || '';

        localStorage.setItem(KEY_NAME, lKey);
        
        return lKey;
    };
    
    
    function ga(){
          _gaq = [['_setAccount', 'UA-26518084-2'], ['_trackPageview']];
        
        var lOnError_f = window.onerror;
        window.onerror = function(msg, url, line) {
            var preventErrorAlert = true;
            _gaq.push(['_trackEvent',
                'JS Error',
                msg,
                navigator.userAgent + ' -> ' + url + " : " + line]);
                
            if(typeof lOnError_f === 'function')
                lOnError_f();
            
            return preventErrorAlert;
        };
    }
    
    function loadScript(pSrc, pFunc){
        var lElement = getById(pSrc);
        if(!lElement){
            var lScript     = document.createElement('script');
            
            lScript.id      =
            lScript.src     = pSrc;
            lScript.onload  = pFunc;
            
            document.body.appendChild(lScript);
        }
    }
    
    function cryptSelected(pSelected, pEncrypt){
        var lAutor,
            lMsgElement,            
            lMsgCrypt,
            lMsg,            
            lKey = getKey() || VKCrypt.setKey();
            
            for(var i=0; i < pSelected.length; i++){
                lMsgElement = pSelected[i].getElementsByClassName('im_log_body')[0];
                lMsgElement = lMsgElement.firstChild;                
                lAutor      = lMsgElement.getElementsByClassName('im_log_author_chat_name')[0];
                if(lAutor)
                    lMsgElement.removeChild(lAutor);
                
                lMsg = lMsgElement.textContent;
                lMsgCrypt   = pEncrypt ? Aes.Ctr.encrypt(lMsg, lKey, 256) :
                                         Aes.Ctr.decrypt(lMsg, lKey, 256);
                
                lMsgElement.textContent = lMsgCrypt;
            }
    }
    
    function getById(pId, pElement){
        return (pElement || document).getElementById(pId);
    }
    
    function getByClass(pClass, pElement){
        return (pElement || document).getElementsByClassName(pClass);
    }
    
})();
