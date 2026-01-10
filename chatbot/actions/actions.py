from typing import Any, Text, Dict, List
import re
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

class ActionAllToys(Action):

    def name(self) -> Text:
        return "action_all_toys"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://toy.pequla.com/api/toy'
        rsp = requests.get(url)
        toys = rsp.json()

        if len(toys) > 0:
            bot_response = {
                "type": "all_toys",
                "data": toys
            }
            dispatcher.utter_message(text='Here are the results', attachment=bot_response)
        else:
            dispatcher.utter_message(text='No toys found')
        return []

class ActionSearchToy(Action):

    def name(self) -> Text:
        return "action_search_toy"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://toy.pequla.com/api/toy'
        rsp = requests.get(url)
        toys = rsp.json()

        search = tracker.get_slot("search_criteria")

        if len(toys) > 0:
            bot_response = {
                "type": "search_toy",
                "data": toys,
                "search": search
            }
            dispatcher.utter_message(text='Here are the results', attachment=bot_response)
        else:
            dispatcher.utter_message(text='No toy found')
        return []

def extract_number_from_text(text):
    """Extract just the number from text like 'less than 4000' or 'under 3000'"""
    if text is None:
        return None

    # If it's already a number, return it
    if isinstance(text, (int, float)):
        return text

    # Convert to string
    text = str(text)

    # Try to find numbers in the text
    numbers = re.findall(r'\d+', text)
    if numbers:
        return int(numbers[-1])  # Return the last number found

    return None

class ActionFilterToys(Action):

    def name(self) -> Text:
        return "action_filter_toys"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://toy.pequla.com/api/toy'
        rsp = requests.get(url)
        toys = rsp.json()

        # Get slots
        desc = tracker.get_slot("desc_criteria")
        toy_type = tracker.get_slot("type_criteria")
        age_group = tracker.get_slot("age_group_criteria")
        target_group = tracker.get_slot("target_group_criteria")
        dateFrom = tracker.get_slot("date_from_criteria")
        dateTo = tracker.get_slot("date_to_criteria")
        price_raw = tracker.get_slot("price_criteria")
        rating_raw = tracker.get_slot("rating_criteria")

        # Extract numbers from price and rating
        price = extract_number_from_text(price_raw)
        rating = extract_number_from_text(rating_raw)

        # Build filters dictionary
        filters = {}

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
        if price is not None:
            filters["price"] = price
        if rating is not None:
            filters["rating"] = rating

        if len(toys) > 0:
            bot_response = {
                "type": "filter_toys",
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

class ActionReserveToy(Action):

    def name(self) -> Text:
        return "action_reserve_toy"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://toy.pequla.com/api/toy'
        rsp = requests.get(url)
        toys = rsp.json()

        reservation = tracker.get_slot("reservation_criteria")

        if len(toys) > 0:
            bot_response = {
                "type": "reserve_toy",
                "data": toys,
                "search": reservation
            }
            dispatcher.utter_message(attachment=bot_response)
        else:
            dispatcher.utter_message(text='No toy found')
        return []
