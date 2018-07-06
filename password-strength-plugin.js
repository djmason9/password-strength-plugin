/**
 * ORIGINAL PLUGIN
 * password_strength_plugin.js
 * Copyright (c) 2010 bitcows (www.bitcows.com)

 * Amended by Benjamin Charity /// https://github.com/benjamincharity/password-strength-plugin /// http://benjamincharity.com
 * Added if statement to enable value updates rather than re-injecting the html each time. This allows for smooth transitions.

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @author Darren Mason (djmason9@gmail.com)
 * @date 3/13/2009
 * @projectDescription Password Strength Meter is a jQuery plug-in provide you smart algorithm to detect a password strength. Based on Firas Kassem orginal plugin - http://phiras.wordpress.com/2007/04/08/password-strength-meter-a-jquery-plugin/
 * @version 1.0.1
 * 
 * @requires jquery.js (tested with 1.3.2)
 * @param shortPass:  "shortPass",  //optional
 * @param badPass:    "badPass",    //optional
 * @param goodPass:   "goodPass",   //optional
 * @param strongPass: "strongPass", //optional
 * @param baseStyle:  "testresult", //optional
 * @param userid:   "",       //required override
 * @param messageloc: 1       //before == 0 or after == 1
 * 
*/

(function($){
  $.fn.shortPass = 'Very Weak';
  $.fn.badPass = 'Weak';
  $.fn.goodPass = 'Pretty Good';
  $.fn.strongPass = 'Strong';
  $.fn.samePassword = 'User name can not match password.';
  $.fn.resultStyle = "";

   $.fn.passStrength = function(options) {

     var defaults = {
        shortPass:    "shortPass",  //optional
        badPass:    "badPass",    //optional
        goodPass:   "goodPass",   //optional
        strongPass:   "strongPass", //optional
        baseStyle:    "testresult", //optional
        userid:     "",       //required override
        messageloc:   1       //before == 0 or after == 1
      };
      var opts = $.extend(defaults, options);

      return this.each(function() {
         var obj = $(this);

        $(obj).unbind().keyup(function()
        {

          var results = $.fn.teststrength($(this).val(),$(opts.userid).val(),opts);

          // determine whether the password strength will be displayed before or after the input
          if(opts.messageloc === 1)
          {

            if($('.' + opts.baseStyle).is(':visible')) {
              // if it exists, update values
              $(this).next("." + opts.baseStyle).removeClass().addClass('testresult ' + $(this).resultStyle).find("span").text(results);
            } else {
              // if it doesn't exist, create it
              $(this).next("." + opts.baseStyle).remove();
              $(this).after("<span class=\""+opts.baseStyle+"\"><span></span></span>");
              $(this).next("." + opts.baseStyle).removeClass().addClass('testresult ' + $(this).resultStyle).find("span").text(results);
            }

          }
          else
          {
            if($('.' + opts.baseStyle).is(':visible')) {
              // if it exists, update values
              $(this).prev("." + opts.baseStyle).addClass($(this).resultStyle).find("span").text(results);
            } else {
              // if it doesn't exist, create it
              $(this).prev("." + opts.baseStyle).remove();
              $(this).before("<span class=\""+opts.baseStyle+"\"><span></span></span>");
              $(this).prev("." + opts.baseStyle).addClass($(this).resultStyle).find("span").text(results);
            }
          }
         });

        //FUNCTIONS
        $.fn.teststrength = function(password,username,option){
            var score = 0;

              //password < 4
              if (password.length < 4 ) { this.resultStyle =  option.shortPass;return $(this).shortPass; }

              //password == user name
              if (password.toLowerCase()==username.toLowerCase()){this.resultStyle = option.badPass;return $(this).samePassword;}

              //password length
              score += password.length * 4;
              score += ( $.fn.checkRepetition(1,password).length - password.length ) * 1;
              score += ( $.fn.checkRepetition(2,password).length - password.length ) * 1;
              score += ( $.fn.checkRepetition(3,password).length - password.length ) * 1;
              score += ( $.fn.checkRepetition(4,password).length - password.length ) * 1;

              //password has 3 numbers
              if (password.match(/(.*[0-9].*[0-9].*[0-9])/)){ score += 5;} 

              //password has 2 symbols
              if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)){ score += 5 ;}

              //password has Upper and Lower chars
              if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){  score += 10;} 

              //password has number and chars
              if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){  score += 15;} 
              //
              //password has number and symbol
              if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)){  score += 15;} 

              //password has char and symbol
              if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)){score += 15;}

              //password is just a numbers or chars
              if (password.match(/^\w+$/) || password.match(/^\d+$/) ){ score -= 10;}

              //verifying 0 < score < 100
              if ( score < 0 ){score = 0;} 
              if ( score > 100 ){  score = 100;} 

              if (score < 34 ){ this.resultStyle = option.badPass; return $(this).badPass;} 
              if (score < 68 ){ this.resultStyle = option.goodPass;return $(this).goodPass;}

             this.resultStyle= option.strongPass;
              return $(this).strongPass;

        };

      });
   };
})(jQuery);

$.fn.checkRepetition = function(pLen,str) {
  var res = "";
   for (var i=0; i<str.length ; i++ ) 
   {
       var repeated=true;

       for (var j=0;j < pLen && (j+i+pLen) < str.length;j++){
           repeated=repeated && (str.charAt(j+i)==str.charAt(j+i+pLen));
           }
       if (j<pLen){repeated=false;}
       if (repeated) {
           i+=pLen-1;
           repeated=false;
       }
       else {
           res+=str.charAt(i);
       }
   }
   return res;
};
