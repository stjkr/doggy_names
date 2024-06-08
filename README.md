
# Doggy Naming Application

Find the official application here https://doggy.sebtheo.uk.

**Choose** a suitable name for your dog by breed, color and gender.

**Contribute** to the site by choosing between three breeds and names, assisted by images, for a given name.

# Info
### Name Dataset
Taken from [Kaggle](https://www.kaggle.com/datasets/marshuu/dog-breeds).

### Breed DataSet
Taken from [Kaggle](https://www.kaggle.com/datasets/thedevastator/dog-names-from-march-2022).

### Colors
Used Gemini to get some dog colors.

### Dog Pictures
Used the [dog.ceo](https://dog.ceo/dog-api/) api.

## API Reference

#### Get all breeds and colors

```http
  GET /api/getBreedsAndColors
```
Returns all the breeds and colors in the database.

#### Get the best name for a dog

```http
  GET /api/getBestName
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `breed`      | `string` | The desired breed. It has to be exactly as in the database. See the getBreedsAndColors. |

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `color`      | `string` | The desired color. It has to be exactly as in the database. See the getBreedsAndColors. |

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `gender`      | `character` | The desired gender. Either M, F or U. |

#### Must include either a breed or color. Gender is not needed


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`POSTGRES_URL`

This must be a link to your PostgreSQL database. I run mine on a simple [vultr](https://www.vultr.com/?ref=9076887) debian server for <$5 a month.



## Tech Stack

**Frontend:** Next

**Backend:** Next 

**Database:** PostgreSQL

**Server:** Debian on [Vultr](https://www.vultr.com/?ref=9076887)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://sebtheo.uk)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sebtheo)

#### Made with ❤️ by stjkr.