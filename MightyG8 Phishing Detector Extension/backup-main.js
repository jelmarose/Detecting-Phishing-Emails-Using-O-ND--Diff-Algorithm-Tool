var gmail;


function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

//***************************************************INPUT****************************************************//

function getInputValues(){

	gmail = new Gmail();
	var values = gmail.get.visible_emails();
  	var tryhere = JSON.stringify(values);

	//Remove space, quotation marks, comma, left brace, comma
  	var rawInputMatrix = tryhere.split(/[\\",\\{:]+/); 
  	rawInputMatrix.pop();

  	console.log("Raw Input Matrix: ", rawInputMatrix);

	return rawInputMatrix;
}

function fixMatrix(rawInputMatrix){
  //Fix formatting for matrix
    var matrix = new Array();
    var subject = "";
    var excerpt = "";
    var len = rawInputMatrix.length;
    var temp = 0;

    while(temp < len){
      if(rawInputMatrix[temp] == "id"){
        matrix.push(rawInputMatrix[temp]); //insert keyword
        temp++;
        matrix.push(rawInputMatrix[temp]); //insert value
      }
      else if(rawInputMatrix[temp] == "title"){
        matrix.push("title"); //insert keyword
        temp++;
        subject = "";
        
        while(rawInputMatrix[temp] != "id"){ //combine the subject line words separated by space
            subject += rawInputMatrix[temp];
            if(rawInputMatrix[temp] == 'excerpt'){ 
            	temp--;
            	break;
            }
            else{
            	temp++;
            }
        }
        sTemp = subject.split("excerpt");
        subject = sTemp[0];
        matrix.push(subject); //insert value
      }
      else if(rawInputMatrix[temp] == "excerpt"){
        matrix.push("excerpt"); //insert keyword
        temp++;
        excerpt = "";
        
        while(rawInputMatrix[temp] != "time"){ //combine the excerpt line words separated by space
            excerpt += rawInputMatrix[temp];
            if(rawInputMatrix[temp] == "time"){
              temp--;
              break;
            }
            else{
              if(temp < len){
                temp++;
              }
              else{ break; }
            }
        }
        matrix.push(excerpt); //insert id value
      }
      else if(rawInputMatrix[temp] == "sender"){
        matrix.push(rawInputMatrix[temp]); //insert keyword
        temp++;
        matrix.push(rawInputMatrix[temp]); //insert value

      }
      temp++;
    }

    console.log("Fixed Input Matrix: ", matrix);
    return matrix;
}

function elimination(fixedInputMatrix){
  var filteredMatrix = new Array();
  var tempMatrix = new Array();

  var len = fixedInputMatrix.length;
  var temp = 0;
  var msg = 0;
  var msgid = 0;
  var msgidstr = "";

  //parse array
  while(temp < len){
    if(fixedInputMatrix[temp] == "title"){
      temp++;
      ////console.log(fixedInputMatrix[temp]);
      if(fixedInputMatrix[temp].includes("PayPal")){
        //console.log("Title: ",fixedInputMatrix[temp]);
        msgid = fixedInputMatrix[temp - 2];
        msgidstr  = fixedInputMatrix[temp - 2];
        //console.log("ID of message: ", msgid);
        msg++;

        //Get Message ID
        tempMatrix.push("id");
        tempMatrix.push(msgid);

        var getEmailDataObj = gmail.get.email_data(msgid);
        var getEmailDataStr = JSON.stringify(getEmailDataObj);
        var tentativeEmails = getEmailDataStr.split(/[<\\",\\{>]+/); 

        var teLen = tentativeEmails.length-1;

        //Get Sender Email Address
        var emailadds = new Array();
        var x = 0;
        tempMatrix.push("email");

        while(x<teLen){
          if(tentativeEmails[x] == "from_email"){
            emailadds.push(tentativeEmails[x+2]);
          }
          x++;
        }

        tempMatrix.push.apply(tempMatrix,emailadds);
        teLen = tentativeEmails.length-1;

        //Get all links
        var links = new Array();
        tempMatrix.push("links");
        while(teLen>0){
          if(tentativeEmails[teLen].includes("http")){
          	if(tentativeEmails[teLen] == "http:///"){
          		teLen--;
          	}
          	else{
          		links.push("links"); //**Tentative
            	links.push(tentativeEmails[teLen]);
          	}
          	
          }
          teLen--;
        }
        tempMatrix.push.apply(tempMatrix,links);

        temp++;
        if(fixedInputMatrix[temp] == "excerpt"){
          temp++;
          if(fixedInputMatrix[temp].includes("PayPal")){
            temp++;
          }
        } 

        //Get DKIM 
        /*
        var eSource = gmail.get.email_source_async(msgidstr, function(eSource){
        	var check = eSource.split("dkim=pass");
        	console.log(check);
        }, function(){console.log("fail");}, false);*/
      }
    }
    else if(fixedInputMatrix[temp] == "excerpt"){
      temp++;
      if(fixedInputMatrix[temp].includes("PayPal")){
        //console.log("Excerpt: ",fixedInputMatrix[temp]);
        msgid = fixedInputMatrix[temp - 4];
        //console.log("ID of message: ", msgid);
        msg++;

        //Get Message ID
        tempMatrix.push("id");
        tempMatrix.push(msgid);

        var getEmailDataObj = gmail.get.email_data(msgid);
        var getEmailDataStr = JSON.stringify(getEmailDataObj);
        var tentativeEmails = getEmailDataStr.split(/[<\\",\\{>]+/); 

        var teLen = tentativeEmails.length-1;

        //Get Sender Email Address
        var emailadds = new Array();
        var x = 0;
        tempMatrix.push("email");

        while(x<teLen){
          if(tentativeEmails[x] == "from_email"){
            emailadds.push(tentativeEmails[x+2]);
          }
          x++;
        }

        tempMatrix.push.apply(tempMatrix,emailadds);
        teLen = tentativeEmails.length-1;

        //Get all links
        var links = new Array();
        tempMatrix.push("links");
        while(teLen>0){
          if(tentativeEmails[teLen].includes("http")){
          	links.push("links"); //*Tentative
            links.push(tentativeEmails[teLen]);
          }
          teLen--;
        }
        tempMatrix.push.apply(tempMatrix,links);
      }
    }
    temp++;

  }

  filteredMatrix.push(tempMatrix);
  console.log("Filtered Matrix: ", filteredMatrix)
  console.log("Total PayPal-related Messages Detected: ", msg);

  return filteredMatrix;
}


//*************************************************** DIFF ***************************************************//
function compareEmail(forEmailComp){
	//console.log("Email Comparison");

	var emailValues = ["paypal@e.paypal.com", "paypal@mail.paypal.com", "service@intl.paypal.com"];
	var compareVal = new Array();
	var inputVal = new Array();
	var diffMatrix = new Array();
	var endOfX = 0;
	var startOfY = 0;
	var endOfY = 0;
	var xCtr = 0;
	var yCtr = 0;
	var yLength = 0;
	var delCtr = 0;
	var insCtr = 0;
	var diffTotal = 0;
	var temp = 0;
	var ins = 0;
	var lowestDiff = -1;
	var lowestDiffValue = "";

	while(temp < emailValues.length){
		////console.log("Message #",temp+1);
		//diffTotal = 0;
		diffMatrix.push("0");
		while(ins < forEmailComp[0].length){
			diffMatrix.push(forEmailComp[0][ins]);
			ins++;
		}
		endOfX = diffMatrix.length;
		startOfY = diffMatrix.length;

		ins = 0; //reset counter
		compareVal = emailValues[temp].split("");
		while(ins < compareVal.length){
			diffMatrix.push(compareVal[ins]);
			ins++;
		}

		endOfY = diffMatrix.length;
		yLength = (endOfY - startOfY) + 1;

		xCtr = 1;
		yCtr = startOfY;

		//Do diff here
		while(xCtr < endOfX){
			if(diffMatrix[xCtr] == diffMatrix[yCtr]){
				////console.log(diffMatrix[xCtr], " and ", diffMatrix[yCtr], " are equal.");
				////console.log("del: ", delCtr, " ins: ", insCtr);
				yCtr++;
			}
			else if(diffMatrix[xCtr] != diffMatrix[yCtr]){
				////console.log(diffMatrix[xCtr], " and ", diffMatrix[yCtr], " are not equal.");
				//If x is greater move right (delete)
				//If y is greater move down (insert)
				if(xCtr < yCtr){
					delCtr++;
					////console.log("del: ", delCtr, " ins: ", insCtr);
				}
				else if(xCtr > yCtr){
					var lastYCtr = yCtr;
					insCtr++;
					yCtr++;
					while(yCtr < diffMatrix.length){
						if(diffMatrix[xCtr] == diffMatrix[yCtr]){
							////console.log(diffMatrix[xCtr], " and ", diffMatrix[yCtr], " are equal.");
							////console.log("del: ", delCtr, " ins: ", insCtr);
							yCtr = lastYCtr;
							break;
						}
						else{
							////console.log(diffMatrix[xCtr], " and ", diffMatrix[yCtr], " are not equal.");
							insCtr++;
							////console.log("del: ", delCtr, " ins: ", insCtr);
						}

						yCtr++;
						if(yCtr == diffMatrix.length){
							////console.log("yCtr is reset here");
							yCtr = startOfY;
							break;
						}
					}
				}
				else{
					delCtr++;
					////console.log("del: ", delCtr, " ins: ", insCtr);
				}
			}
			xCtr++;
			if(xCtr == endOfX){
				while(yCtr < endOfY){
					insCtr++;
					yCtr++;
				}
			}
		}

		if(emailValues[temp] != forEmailComp[0]){
			console.log("Email address not equal");
		}
		else{
			console.log("Email address equal");
		}

		temp++;

		diffTotal = delCtr + insCtr;

		if(diffTotal == 0){
			console.log("PAIR");
			return "PAIR";
		}

		diffMatrix.length = 0; //reset diffMatrix
		ins = 0; //reset counter
		delCtr = 0; insCtr = 0;

		
	}

	return diffTotal;
}

function compareLinks(forLinkComp){
	//console.log("Link Comparison");

	var linkValues = ["https://www.paypal.com/", "http://epl.paypal-communication.com/", "https://t.paypal.com/", "https://paypalobjects.com/"];
	var compareVal = new Array();
	var inputVal = new Array();
	var diffMatrix = new Array();
	var endOfX = 0;
	var startOfY = 0;
	var endOfY = 0;
	var xCtr = 0;
	var yCtr = 0;
	var yLength = 0;
	var delCtr = 0;
	var insCtr = 0;
	var diffTotal = 0;
	var temp = 0;
	var ins = 0;
	var lowestDiff = -1;
	var lowestDiffValue = "";

	while(temp < linkValues.length){
		//diffTotal = 0;
		diffMatrix.push("0");
		while(ins < forLinkComp[0].length){
			diffMatrix.push(forLinkComp[0][ins]);
			ins++;
		}
		endOfX = diffMatrix.length;
		startOfY = diffMatrix.length;

		ins = 0; //reset counter
		compareVal = linkValues[temp].split("");
		while(ins < compareVal.length){
			diffMatrix.push(compareVal[ins]);
			ins++;
		}

		endOfY = diffMatrix.length;
		yLength = (endOfY - startOfY) + 1;

		xCtr = 1;
		yCtr = startOfY;

		//Do diff here
		while(xCtr < endOfX){
			if(diffMatrix[xCtr] == diffMatrix[yCtr]){
				////console.log(diffMatrix[xCtr], " and ", diffMatrix[yCtr], " are equal.");
				////console.log("del: ", delCtr, " ins: ", insCtr);
				yCtr++;
			}
			else if(diffMatrix[xCtr] != diffMatrix[yCtr]){
				////console.log(diffMatrix[xCtr], " and ", diffMatrix[yCtr], " are not equal.");
				//If x is greater move right (delete)
				//If y is greater move down (insert)
				if(xCtr < yCtr){
					delCtr++;
					////console.log("del: ", delCtr, " ins: ", insCtr);
				}
				else if(xCtr > yCtr){
					var lastYCtr = yCtr;
					insCtr++;
					yCtr++;
					while(yCtr < diffMatrix.length){
						if(diffMatrix[xCtr] == diffMatrix[yCtr]){
							////console.log(diffMatrix[xCtr], " and ", diffMatrix[yCtr], " are equal.");
							////console.log("del: ", delCtr, " ins: ", insCtr);
							yCtr = lastYCtr;
							break;
						}
						else{
							////console.log(diffMatrix[xCtr], " and ", diffMatrix[yCtr], " are not equal.");
							insCtr;
							////console.log("del: ", delCtr, " ins: ", insCtr);
						}

						yCtr++;
						if(yCtr == diffMatrix.length){
							////console.log("yCtr is reset here");
							yCtr = startOfY;
							break;
						}
					}
				}
				else{
					delCtr++;
					////console.log("del: ", delCtr, " ins: ", insCtr);
				}
			}
			xCtr++;
			if(xCtr == endOfX){
				while(yCtr < endOfY){
					insCtr++;
					yCtr++;
				}
			}
		}

		temp++;

		diffTotal = delCtr + insCtr;

		//console.log("X starts at ", diffMatrix[1], "and ends at ", diffMatrix[endOfX]);
		//console.log("Y starts at ", diffMatrix[startOfY], "and ends at ", diffMatrix[diffMatrix.length-1]);
		//console.log("Total del: ", delCtr);
		//console.log("Total ins: ", insCtr);
		//console.log("Total number of diff: ", diffTotal);
		/*
		if(diffTotal == 0){
				lowestDiff = diffTotal;
				lowestDiffValue = linkValues[temp-1];
		}
		else{
			lowestDiff = 
		}*/

		//console.log("diff matrix length: ",diffMatrix.length);
		diffMatrix.length = 0; //reset diffMatrix
		ins = 0; //reset counter
		delCtr = 0; insCtr = 0;
	}

	//console.log("Comparison value with the lowest diff: ", lowestDiffValue);
	//console.log("No. of diff: ", lowestDiff);

	return diffTotal;
}

function diffMain(filteredMatrix){
	var resultMatrix = new Array();
	var forEmailComp = new Array();
	var forLinkComp = new Array();
	var valueSplit = new Array();
	var i = 0;

	//console.log("This is the diff main funx");

	while(i < filteredMatrix[0].length){
		////console.log("Value of i: ", i);
		////console.log("Value of filteredMatrix[0].length: ", filteredMatrix[0].length);
		////console.log("Current query: ", filteredMatrix[0][i]);
		if(filteredMatrix[0][i] == "id"){
			resultMatrix.push(filteredMatrix[0][i]);
			i++;
			resultMatrix.push(filteredMatrix[0][i]);
			//console.log("Message #", i);
		}
		else if(filteredMatrix[0][i] == "email"){
			resultMatrix.push(filteredMatrix[0][i]);
			i++;
			resultMatrix.push(filteredMatrix[0][i]);
			valueSplit = filteredMatrix[0][i].split("");
			forEmailComp.push(valueSplit);

			var diffValue = compareEmail(forEmailComp);
			if(diffValue == "PAIR"){
				resultMatrix.pop();
				resultMatrix.pop();
				resultMatrix.pop();
				resultMatrix.pop();
			}
			//resultMatrix.push(diffValue);
		}
		else if(filteredMatrix[0][i] == "links"){
			resultMatrix.push(filteredMatrix[0][i]);
			i++;
			resultMatrix.push(filteredMatrix[0][i]);
			valueSplit = filteredMatrix[0][i].split("");
			forLinkComp.push(valueSplit);

			var diffValue = compareLinks(forLinkComp);
			resultMatrix.push(diffValue);
			/*
			while(filteredMatrix[0][i] != "links"){
				////console.log("More link here");
				resultMatrix.push(filteredMatrix[0][i]);
				i++;
				resultMatrix.push(filteredMatrix[0][i]);
				valueSplit = filteredMatrix[0][i].split("");
				forLinkComp.push(valueSplit);

				var lowestDiffValue = compareLinks(forLinkComp);
				resultMatrix.push(lowestDiffValue);
				i++;
			}*/
		}
		i++;
	}
	console.log("Result Matrix: ", resultMatrix);
	return resultMatrix;

	/*
		result matrix format
		[0] id
		[1] id value
		[2] email
		[3] email value
		[4] least diff
		[5] links
		[6] link1 value
		[7] least diff
		[8] links
		[9] link2 value
		[10] least diff
		...

	*/
}

//*************************************************** EVAL ***************************************************//

function evaluation(resultMatrix, fixedInputMatrix){
	var i = 0;
	var j =0;
	var currentID = "";
	var numOfPME = 0; //number of potentially malicious emails
	var emailInputValue = "";
	var emailCompareValue = "";
	var dkimVal = "";
	var displayList = new Array();
	/*
		[0] email subject
		[1] sender email add
		[2] id value
		[3] no. of pm links
		[4] dkim results
	*/


	while(i < resultMatrix.length){
		if(resultMatrix[i] == "id"){
			i++;
			currentID = resultMatrix[i];
			while(j < fixedInputMatrix.length){
				if(currentID == fixedInputMatrix[j]){
					displayList.push(fixedInputMatrix[j+2]); //push email subject
					displayList.push(fixedInputMatrix[j+6]); //push sender email add
					displayList.push(fixedInputMatrix[j]); //push id value
				}
				j++;
			}
			i++;
		}
		i++;
	}

	console.log("Display List: ", displayList);

	if(numOfPME > 0){
		displayOutput(displayList);
	}
}

//*************************************************** OUTPUT ***************************************************//

function createDisplayMessage(displayList){
	var displayMessage = "";
	var pTag = "<p>";
	var bOpenTag = "<b>";
	var bCloseTag = "</b>";

	var subjVal = "Hello World"; //default value
	var senderVal = "hello@you.com"; //default value
	var idVal = "000000000"; //default value
	var dkimVal = "PASS"; //default value
	var linksVal = "0"; //default value

	var header = "";
	var dkimResult = "";
	var linksResult = "";

	var lineA = "We found potentially malicious emails in your inbox!" + pTag;
	displayMessage = lineA;

	var i = 0;

	while(i < displayList.length){
		subjVal = displayList[i];
		i++;
		senderVal = displayList[i];
		i++;
		idVal = displayList[i];
		i++;
		linksVal = displayList[i];
		i++;
		dkimVal = displayList[i];
		i++;

		header = pTag + "\"" + bOpenTag + subjVal + bCloseTag + "\" sent by " + bOpenTag + senderVal + bCloseTag + " (ID no.: " + idVal + ")";
		//dkimResult = pTag + "DKIM: " + dkimVal;
		//linksResult = pTag + "No. of Potentially Malicious Links: " + linksVal;

		displayMessage = displayMessage + header;
	}

	return displayMessage;
}

function displayOutput(displayList){
	var displayMessage = createDisplayMessage(displayList);
	gmail.tools.add_modal_window('MightyG8 Phishing Detection', displayMessage,
		function() {
			gmail.tools.remove_modal_window();
		}
	);
}

//*************************************************** MAIN ***************************************************//


var main = function(){

  var rawInputMatrix = getInputValues();
  var fixedInputMatrix = fixMatrix(rawInputMatrix);
  var filteredMatrix = elimination(fixedInputMatrix);

  var resultMatrix = diffMain(filteredMatrix);
  evaluation(resultMatrix, fixedInputMatrix);


  /*
		[0] email subject
		[1] sender email add
		[2] id value
		[3] no. of pm links
		[4] dkim results
	*/


}


refresh(main);