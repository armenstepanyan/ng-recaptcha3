# ng-recaptcha3
Angular service for Google reCAPTCHA 3

See [Demo](https://stackblitz.com/edit/ng-recaptcha3)

# Installation

Run following command to install ng-recaptcha3

```sh
npm i ng-recaptcha3 --save
```

# How to use?
reCAPTCHA v3 introduces a new concept: **actions**. When you specify an action name in each place you execute reCAPTCHA you enable two new features:

- a detailed break-down of data for your top ten actions in the [admin console](https://g.co/recaptcha/admin)
- adaptive risk analysis based on the context of the action (abusive behavior can vary)
Importantly, when you verify the reCAPTCHA response you should also verify that the action name matches the one you expect.

## Front
At first you need to import ```NgRecaptcha3Service``` to your component

```s 
import { NgRecaptcha3Service } from 'ng-recaptcha3'
```

Then inject it to your component constructor
```
export class AppComponent implements OnInit {


  constructor(private recaptcha3: NgRecaptcha3Service) {
  

  }
```

Pass your siteKey to init function

```angular2html
  ngOnInit() {    
    this.recaptcha3.init(YOUR_SITE_KEY)
  }
```

The `init` function will return Promise with `status` parameter that will indicate script loaded status
```
  ngOnInit() {    
    this.recaptcha3.init(YOUR_SITE_KEY).then(status => {
      // status: success/error
      // success - script is loaded and greaptcha is ready
      // error - script is not loaded
      console.log(status)
    })
  }
```

On form submit generate recaptcha token (it will be checked in backend) using *siteKey*

```angular2html

  onSubmit() {
    this.submitted = true;
    if (this.myForm.inValid) {
      return;
    }

    // generate new token
    this.recaptcha3.getToken().then(token => {
      const formData = this.myForm.value;
      formData.recaptchaToken = token;
      // send data with token to backend
      this.http.post(url,formData) ....

    }, error => {
      // get error, e.g. if key is invalid
      console.log(error)
    }

  }
```

Execute `getToken` with action name. See more [here](https://developers.google.com/recaptcha/docs/v3#actions)
``` 
this.recaptcha3.getToken({ action: 'homepage' })
``` 

You can destroy recaptcha in ngOnDestroy
```angular2html
  public ngOnDestroy() {
    this.recaptcha3.destroy();
  }
}
```

## Backend
In backend we need to verify given token using secretKey.
### node.js example
```angular2html
const request = require('request-promise');

 const secretKey = YOUR_RECAPTCHA_SECRET_KEY;
 const userIp = 'USER_IP';
     request.get(
        {
            url: `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}&remoteip=${userIp}`,
        }).then((response) => {

        // If response false return error message
        if (response.success === false) {
            return res.json({success: false, error: 'Recaptcha token validation failed'});
        }
        // otherwise continue handling/saving form data
        next();
    })
```

### PHP example
```angular2html
$recaptchaToken = isset($_POST['recaptchaToken']) ? $_POST['recaptchaToken'] : false;

  if(!$recaptchaToken) {
    //Do something with error
  }
  
  $secretKey = YOUR_RECAPTCHA_SECRET_KEY;
  $userIp = $_SERVER['REMOTE_ADDR'];
  $response=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$recaptchaToken."&remoteip=".$userIp);
  
  if($response.success == false){
              //Do something with error
              
  } else {
    // reCaptchaToken is valid you can continue with the rest of your code
  }
```
