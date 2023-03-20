import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

const PLUGIN_NAME = 'SnowPlugin';

export default class SnowPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }


  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const options: Flex.ContentFragmentProps = { sortOrder: -1 };

    //set servicenow base URL here:
    let screenPopBaseURL = "https://dev69218.service-now.com";

    //remove crm panel
    flex.AgentDesktopView.defaultProps.showPanel2 = false;

    //calculate where to open the other apps
    function getAnchorString() : string {
      let flexWidth = window.innerWidth;
      let appWidth = window.screen.availWidth - flexWidth;
      let appHeight = window.screen.availHeight;
      let anchorString = `left=${flexWidth}, width=${appWidth},height=${appHeight}`;
      console.log(anchorString)
      return anchorString;
    } 
    
    flex.Actions.addListener("beforeAcceptTask", (payload, cancelActionInvocation) => {
      console.log("we would check if the task comes with an incident attribute or not");
      console.log(payload.task);
      /*
      * Check type of incident. If it is a new incident request, we screenpop the new incident page
      * Otherwise we attempt to open the existing ticket identified in studio. Note that we're not treating non-existent incident numbers in this POC
      * Otherwise we open the list of incidents for that customer, if that customer exists. If we cannot find the caller, we open the new incident page
      * */
      let screenPopURL = '';
      //remove whatsapp prefix in the event it is a whatsapp msg
      let from = payload.task.attributes.from.replace("whatsapp:", "");
      const anchorString = getAnchorString();
      //replace + for SNOW url 
      from = from.replace("+", "%2B");
      
      if(payload.task.attributes.sntype === "new"){
        console.log("if it is a new incident we screenpop a different window")
        screenPopURL = screenPopBaseURL + "/incident.do?sys_id=-1&sysparm_query=comments=" + payload.task.attributes.comment;
        window.open(screenPopURL, "", anchorString);
      }
      else if( 'incident' in payload.task.attributes) {
        console.log("if it has an incident attribute we need to screen pop it")
        screenPopURL = screenPopBaseURL + "/incident.do?sysparm_query=number=INC" + payload.task.attributes.incident;
        window.open(screenPopURL, "", anchorString);
      }
      else {
        console.log("if it is an existing ticket but no number is provided we screenpop the ticket list for the user based on phone number");
        console.log("if there are no tickets against this number, it will open the new ticket interface");
        screenPopURL = screenPopBaseURL + "/cti.do?sysparm_caller_phone=" + from;
        window.open(screenPopURL , "", anchorString);
      }
      
    })
    //Shortcut to open all incidents 
    Flex.SideNav.Content.add(
    <Flex.SideLink
      showLabel={ true }
      icon="OpenInNewWindow"
      isActive={false}
      onClick={() => {
        const anchorString = getAnchorString();
        window.open(`${screenPopBaseURL}/now/nav/ui/classic/params/target/incident_list.do`, "", anchorString) } }
      key="AllIncidentsPageSideLink"
    >
      All incidents
    </Flex.SideLink>
    );

    //Shortcut to open a different tool like a CRM, just for demo purposes
    Flex.SideNav.Content.add(
      <Flex.SideLink
        showLabel={ true }
        icon="OpenInNewWindow"
        isActive={false}
        onClick={() => {
          const anchorString = getAnchorString();
          window.open("https://app-eu1.hubspot.com/contacts/26128285/objects/0-1/views/all/list", "", anchorString) 
        } }
        key="SpecificIncidentPageSideLink"
      >
        Open CRM
      </Flex.SideLink>
    ); 

  }
}
