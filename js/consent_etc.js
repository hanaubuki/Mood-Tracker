var startpage = {};

startpage.task = {};
// TEXT ON THE FIRST PAGE  ----------------------------------------------------------------------


startpage.section = {};
startpage.section.header =
    '<!-- ####################### Heading ####################### -->' +
    '<a name="top"></a>' +
    '<h1 style="text-align:center;" id="header" class="header">' +
    '   &nbsp; University of Bristol Study: <br> Emotional Responses to Shapes </h1>';


  startpage.task.blurb = '<p>This is an experiment in which you\'ll look at various shapes, and tell us how they make you feel. <br/> The experiment will take <b>a minimum of 10 minutes </b> and cannot be completed more quickly than this.</p>'+
    '<p>Because we need you to reflect on how shapes make you feel, the experiment will prevent you from moving on too quickly. <b>You will not be able to click continue on each page until enough time has passed to reflect on the image</b>. This may feel a little slow, but it is neccessary for our experiment.</p>' +
     // '<p>If you rapidly and repeatedly click on the "continue" button to get through as quickly as possible this will be recorded, and treated as a lack of engagement. This may cause your submission may be rejected. </p>'  +
      '<p><b>Some users on prolific like to complete surveys as quickly as possible, and they choose surveys that are quick and easy to complete. We understand this, but it will not be possible in this experiment.</b> If you are not happy with this, please return to prolific now and indicate that you do not wish to participate.</p>'  +
    'This study is run by the University of Bristol. <br /><b>You must be 18 or over to participate and you should be fluent in written English.';



startpage.section.start =
    '<!-- ####################### Start page ####################### -->' +
    '<div class="start">' +
    '<div class="start" style="text-align:left; border:0px solid;">' +
    '<p>' + startpage.task.blurb + '</p> ' +
        '</div>' +
    '</div>';


    var startPage = {
        type: jsPsychHtmlButtonResponse,
        stimulus: startpage.section.header + startpage.section.start,
        choices: ["continue"]
    }



    function checkUserIDResponse(data, textStatus, jqXHR){
      // console.log("data: "+data)
      parts = data.split(",", 4);
      if(parts[0] == "NOTFOUND"){
        console.log("user not found")
      } else if (parts[0] == "NEWUSER") {
        console.log("generating new user")
        Fcount = Number(parts[1])
        Ucount = Number(parts[2])
        if(Math.random()>=0.5){
          TextType = "B";
        } else {
          TextType = "A";
        }
        trialPart = 1;
        userCode = (Math.floor(Math.random() * 899999) + 100000).toString();
        if(Fcount>Ucount+3){
          condition = 'U';
        } else if(Ucount>Fcount+3){
          condition = 'F';
        } else {
          if(Math.random()>=0.5){
              condition = "U";
          } else {
              condition = "F";
          }
          // console.log(userCode, condition, trialPart);
        } 
      } else {
        // USER FOUND
        // console.log("user found")
        userCode = parts[0]
        condition = parts[1] == "F" ? "U" : "F";
        trialPart = Number(parts[2])+1;
        if(parts[3]=="A"){
          TextType = "B";
        } else {
          TextType = "A";
        }        
      }
      // console.log("response processed. UserCode: " + userCode);
      jsPsych.resumeExperiment();
    }

    function checkUserID(userID, callback){
      $.post('checkid',{"userID": userID}, callback); 
      // pause until we've got the data back from the server
      // console.log("post sent. UserCode: " + userCode);
      jsPsych.pauseExperiment();
    }


    var consentHTML =
    '   <!-- ####################### Consent ####################### -->' +
    '   <div class="consent1">' +
    '       <div class="consent" style="text-align:left; border:0px solid">' +
    // '            <p align="right">Approval No ' + welcome.ethics.approval + '</p>' +
    '           <p align="center"><b>THE UNIVERSITY OF BRISTOL: ' +
    '           <br /> PARTICIPANT INFORMATION AND CONSENT FORM</b><br>' + 
    // welcome.ethics.name + '</b></p>' +
    '       <p>This page provides information on the study, and what you what you will be asked to do if you agree to be involved. At the bottom of the page you can give consent to continue with the study. To withdraw you can simply close this browser tab at any time. If you withdraw in this way, your data will automatically be deleted from the study and destroyed. In addition, you are free to not answer specific items about yourself. </p>' +

    '       <p><strong>Purpose of study</strong><br />' +
    '       We aim to understand how different features of shapes influence how people perceive their emotional meaning or "affect". This information can be used to help design systems which help children and adults record and communicate their emotions. </p>' +

    '       <p><strong>Time commitment</strong>' +
    '       <br />The study will take about 10 minutes' +    

    '       <p><strong>What do I do in this study?</strong><br />' +
    '       You will first be introduced to the experiment environment with some training exercises. Then you will be asked to respond to 24 images, recording your emotional response. Finally, you will be asked to describe your gender, age, and fluency in English.</p>' +   

    '   <p><strong>Do I have to take part? Can I withdraw?</strong><br />' +
    '       You do not have to take part and you can withdraw at any time without having to give a reason. You can give consent by clicking the confirm button at the bottom of this page. ' +

    '       <p><strong>What data is captured ?</strong><br />' +
    '       We only record your responses to the images, your description of gender, age, and English fluency. No information which could identify you is requested. </p>' +
    
    '       <p><strong>What will happen to my data?</strong><br />' +
      
    '       <p>Your involvement in the study will remain confidential. This information will only be available to research staff and national bodies which monitor whether research studies are conducted properly. Your study data will be anonymised. This means that it will be given an identification number and any identifying information about you will be removed. Therefore, it will not be possible to identify you by name from any aspect of documentation or reporting for this research study. At the end of the study your data will be made <q>Open Data</q>. This means that it will be stored in an online database so that it is publicly available.' +

    '       <p><strong>What is open Data?</strong><br />' +
      
    '       <p>Open data means that data are made available, free of charge, to anyone interested in the research, or who wishes to conduct their own analysis of the data. We will therefore have no control over how these data are used. However, all data will be anonymised before it is made available and therefore there will be no way to identify you from the research data.' +

    '       <p><strong>Why open data?</strong><br />' +
      
    '       <p>Open access to research findings and access to data is considered best research practice and is a requirement of many funding bodies and journals. As a large proportion of research is publicly funded, the outcomes of the research should be made publicly available. Sharing data helps to maximise the impact of investment through wider use, and encourages new avenues of research.' +


    // '           <p><b>Recompense to participants</b></p>' +
    // '           <p>As stated on the Amazon Mechanical Turk page, the pay for completing this HIT is <b>' + welcome.task.pay + '</b></p>' +
    '       <p><strong>What are the possible risks and disadvantages of taking part?</strong><br />' +
    '       There are no known risks or disadvantages to you associated with this experiment.</p>' +

  '       <p><strong>Who is organising this research? </strong><br /> This research is organised by Dr Feng Feng, a research associate at the University of Bristol.</p>' +    

  '       <p><strong>Who has reviewed the study? </strong><br /> This research has been reviewed by Dr Oussama Metatla and by the Faculty Research Ethics Committee.</p>' +        '       <p>This study has been approved on ethical grounds by the University Of Bristol Faculty Of Engineering Ethics Board.&nbsp; Any questions regarding your rights as a participant may be addressed to that committee through the Faculty Ethics Officer (<a href="http://www.bris.ac.uk/red/support/governance/ethics/ethics.html">see details here</a>). Please note that you are free to withdraw from participation at any time.</p>' +
    '       <p>&nbsp;</p>' +
    '           <p align="center"><b>PARTICIPANT CONSENT</b></p>' +
    '           By continuing, you are making a decision whether or not to participate. ' +
   
    '   If you wish to ask further questions before participating you may contact us via Prolific.<br/>' + 
    '   Alternatively, if you feel you are satisfied with the information you have been provided, you can click the button below to continue <br/>' +
    '  <b>By clicking this button you agree to the following statement</b>:  "I confirm that you have read the information on this page, and that I consent to participate. I may withdraw at any time before completion of the study, simply by closing the website. My data will then be automatically deleted. If I complete the study and submit my data, I understand that after the study the data will be made <q>open data</q>. I understand that this means the anonymised data will be publicly available and may be used for purposes not related to this study, and it will not be possible to identify me from these data."' +  
    '           <br>' +
    // '           <p align="center">' +
    // '           <input type="button" id="consentButton1" class="consent jspsych-btn" value="I agree" onclick="welcome.click.consent1()" >' +
    // '           </p>' +
    '       </div><br><br></div>';


    var consent_page = {
        type: jsPsychHtmlButtonResponse,
        stimulus: consentHTML,
        choices: ["I agree"]
    }




    var demog_page = {
        type: jsPsychSurveyText,
        preamble: [    
            '<p font-size:110%><b>Demographic information:</b></p>' +
            '<p>We use this information to check that our sample is representative. We do not record your name and none of this data will be connected to your identity in any of our analyses. <br/><br/> All data will be deleted if you withdraw.</p>'
            ],
        questions: [
            {prompt: "gender", rows: 1, columns: 12, required: false},
            {prompt: "age", rows: 1, columns: 3, required: false},
            {prompt: "country", rows: 1, columns: 20, required: false},
          ],
          data: {easyName: 'demographics'},
    }





    /* define the debrief block */
    var debrief_page = {
      type: jsPsychInstructions,
      pages: ['<p>Thanks for participating.</p><br><p>Click next to submit your data.</p>',],
      show_clickable_nav: true
    };


    /* placeholder */
    var placeholder_page = {
        type: 'instructions',
        pages: [
            'click to move on'
        ],
        show_clickable_nav: true
    }


    