import os

import pandas as pd

scripts_dir = os.path.dirname(os.path.realpath(__file__))
df = pd.read_excel(os.path.join(scripts_dir, "cards.xlsx"), sheet_name="Master")
df["id"] = df.index

# Sort cards: Dragons first (by number), then Caves (by number)
df['type_order'] = df['type'].map({'Dragon': 0, 'Cave': 1})
df = df.sort_values(['type_order', 'number'])
df = df.drop('type_order', axis=1)

# Add sort_id based on the desired order
df = df.reset_index(drop=True)
df["sort_id"] = df.index
df.to_json(os.path.join(scripts_dir, "../src/assets/cards.json"), orient="records", indent=2)
