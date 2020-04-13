import requests

BASE_URL = 'https://api.punkapi.com/v2/beers'
RESULTS_PER_PAGE = 10

class BeerDAO:
    def __init__(self):
        self.url = BASE_URL
        self.result_cap = RESULTS_PER_PAGE

    def __enter__(self):
        print("DB connection initialized")
    
    def __exit__(self, pos_1, pos_2, pose_3):
        print("DB connection closed")

    def get_beer(self, id):
        if not id: get_beers()

        payload = {'per_page': self.result_cap, 'ids': id}
        try:
            r = requests.get(BASE_URL, params=payload)
            r.raise_for_status()
            
            data = r.json()

            print(f'Fetched {len(data)} items')

            return data
        except:
            return []

    def get_beers(self, beer_name='', page=1):
        payload = {'per_page': self.result_cap, 'page': page}
        if beer_name:
            payload['beer_name'] = beer_name
        
        try:
            r = requests.get(BASE_URL, params=payload)
            r.raise_for_status()
            
            data = r.json()

            print(f'Fetched {len(data)} items')
            
            return data
        except:
            return []

