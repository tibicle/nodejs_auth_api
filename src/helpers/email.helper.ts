"use strict";

import Email from "email-templates";

class EmailHelper {

	//
	// get the html 
	//
	async ejsToHtml(templateName?: any, data?:any) {
		
		//
		//  Convert template to html string
		//
		const email = new Email({
			views: {
				options: {
					extension: 'ejs',
				},
			},
		});

		//
		//  Pass dynamic variables to template
		//
		const html = email.render(templateName, data);
		
		return html;


	}

}

export default new EmailHelper();
