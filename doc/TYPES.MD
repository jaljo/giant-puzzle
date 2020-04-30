@type Character :: {
  id :: String
  asset :: String
  direction :: String
}

@type Tile :: {
  x :: Number
  y :: Number
  char :: Character
  locked :: Boolean
}

@type Coordinates :: {
  x :: Number
  y :: Number
}

