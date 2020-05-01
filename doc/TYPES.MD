```javascript
@type Character :: {
  id :: String
  asset :: String
  direction :: String
}
```

```javascript
@type Tile :: {
  x :: Number
  y :: Number
  char :: Character
  locked :: Boolean
}
```
