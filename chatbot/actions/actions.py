from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
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
            bot_response = {
                "type": "toy_list",
                "data": toys
            }
            dispatcher.utter_message(text='Here are the results', attachment=bot_response)
        else:
            dispatcher.utter_message(text='No toys found') 
        return []

class ActionSearchToys(Action):

    def name(self) -> Text:
        return "action_search_toys"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://toy.pequla.com/api/toy'
        rsp = requests.get(url)
        toys = rsp.json()

        search = tracker.get_slot("search_criteria")
        desc = tracker.get_slot("desc_criteria")
        toy_type = tracker.get_slot("type_criteria")
        age_group = tracker.get_slot("age_group_criteria")
        target_group = tracker.get_slot("target_group_criteria")
        dateFrom = tracker.get_slot("date_from_criteria")
        dateTo = tracker.get_slot("date_to_criteria")
        price = tracker.get_slot("price_criteria")
        rating = tracker.get_slot("rating_criteria")

        filters = {}

        if search:
            filters["search"] = search
        if desc:
            filters["desc"] = desc
        if toy_type:
            filters["type"] = toy_type
        if age_group:
            filters["age_group"] = age_group
        if target_group:
            filters["target_group"] = target_group
        if dateFrom:
            filters["dateFrom"] = dateFrom
        if dateTo:
            filters["dateTo"] = dateTo
        if price:
            filters["price"] = price
        if rating:
            filters["rating"] = rating
        
        if len(toys) > 0:
            bot_response = {
                "type": "toy_list",
                "data": toys,
                "filters": filters
            }
            dispatcher.utter_message(text='Here are the results', attachment=bot_response)
        else:
            dispatcher.utter_message(text='No toys found') 
        return []

class ActionResetFilter(Action):

    def name(self) -> Text:
        return "action_reset_filter"

    def run(self, dispatcher, tracker, domain):

        dispatcher.utter_message(text="Filters resetted")

        return [
            SlotSet("search_criteria", None),
            SlotSet("desc_criteria", None),
            SlotSet("type_criteria", None),
            SlotSet("age_group_criteria", None),
            SlotSet("target_group_criteria", None),
            SlotSet("date_from_criteria", None),
            SlotSet("date_to_criteria", None),
            SlotSet("price_criteria", None),
            SlotSet("rating_criteria", None)
        ]
