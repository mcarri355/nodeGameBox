# nodeGameBox

This project is a our all new online Memory Matcher Gamer a fun and interative game where the user previews given cards and match them based on what they remember. This project is this in the works so look forwards to updates


## Authors

- [@gbaref949](https://github.com/gbaref949)- Georgiana
- [@mcarri355](https://github.com/mcarri355)- Matthew

## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.


## Deployment

To deploy this project run

```bash
  npm run deploy
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY