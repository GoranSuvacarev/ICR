from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests


class ActionHelloWorld(Action):

    def name(self) -> Text:
        return "action_hello_world"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Hello World from Actions!")
        return []
    
class ActionLatestToys(Action):

    def name(self) -> Text:
        return "action_latest_toys"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://toy.pequla.com/api/toy'
        rsp = requests.get(url)
        toys = rsp.json()

        if len(toys) > 0:
            dispatcher.utter_message(text='Here are some toys', attachment=toys)
        else:
            dispatcher.utter_message(text='Not enought toys found') 
        return []
