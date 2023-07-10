<a name="readme-top"></a>



<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dorkodu/id">
    <img src="web/src/assets/id_brand-light.svg" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Dorkodu ID</h3>

  <p align="center">
    Your Digital Identity @ Dorkodu
    <br />
    <a href="https://id.dorkodu.com">View Demo</a>
    ·
    <a href="https://github.com/dorkodu/id/issues">Report Bug</a>
    ·
    <a href="https://github.com/dorkodu/id/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Dorkodu ID Welcome Screen Shot][product-screenshot-welcome]](https://id.dorkodu.com)
[![Dorkodu ID Dashboard Screen Shot][product-screenshot-dashboard]](https://id.dorkodu.com)

Your Digital Life, One Account.

Connect with ID, and get the most out of all the Dorkodu apps you use.

* Get a personalized experience.
* Be verified everywhere.
* Your life's information in one place.
* All apps are always connected.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

TypeScript, React, Zustand, Mantine, i18next, NodeJS, Postgres, Docker, Nginx

* [![Typescript][Typescript]][Typescript-url]
* [![React.js][React.js]][React-url]
* [![Node.js][Node.js]][Node-url]
* [![Docker][Docker]][Docker-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [Docker](https://docker.com)
* pnpm
  ```sh
  npm install -g pnpm
  ```
  

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/dorkodu/id.git
   ```
2. Install PNPM packages
   ```sh
   pnpm install -r
   ```
3. Run docker container & check localhost:8000
   ```sh
   pnpm run docker:dev
   ```
4. Perform database migrations
   ```sh
   docker exec id_dev-id_api-1 sh -c "cd /id/api; pnpm migrate:dev:latest; exit"
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

You can use the application as you wish but, we currently don't have a public API.
If you have more questions, check [Issues](https://github.com/dorkodu/id/issues)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Secure authentication
- [x] Access to other apps (ex. Dorkodu Forum)
- [x] New UI
- [x] Backend optimizations
- [ ] Public API
- [ ] Decentralization

See the [open issues](https://github.com/dorkodu/id/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

[Berk Cambaz](https://linkedin.com/in/berkcambaz) - berkcambaz12321@gmail.com
<br />
[Doruk Eray](https://linkedin.com/in/dorukeray) - doruk@dorkodu.com

Project Link: [https://github.com/dorkodu/id](https://github.com/dorkodu/id)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Paragon Initiative Enterprises](https://paragonie.com/blog/2015/04/secure-authentication-php-with-long-term-persistence)
* [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
* [Nginx](https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/)
* [Tabler Icons](https://tabler-icons.io)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/dorkodu/id.svg?style=for-the-badge
[contributors-url]: https://github.com/dorkodu/id/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/dorkodu/id.svg?style=for-the-badge
[forks-url]: https://github.com/dorkodu/id/network/members

[stars-shield]: https://img.shields.io/github/stars/dorkodu/id.svg?style=for-the-badge
[stars-url]: https://github.com/dorkodu/id/stargazers

[issues-shield]: https://img.shields.io/github/issues/dorkodu/id.svg?style=for-the-badge
[issues-url]: https://github.com/dorkodu/id/issues

[license-shield]: https://img.shields.io/github/license/dorkodu/id.svg?style=for-the-badge
[license-url]: https://github.com/dorkodu/id/blob/master/LICENSE.txt

[product-screenshot-welcome]: www/id.dorkodu.com_welcome.png
[product-screenshot-dashboard]: WWW/id.dorkodu.com_dashboard.png

[Typescript]: 	https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://typescriptlang.org

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org

[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org

[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/