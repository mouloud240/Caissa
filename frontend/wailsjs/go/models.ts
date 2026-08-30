export namespace main {
	
	export class ToolCallInfo {
	    tool: string;
	    detail: string;
	
	    static createFrom(source: any = {}) {
	        return new ToolCallInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tool = source["tool"];
	        this.detail = source["detail"];
	    }
	}
	export class AgentResponse {
	    message: string;
	    toolCalls?: ToolCallInfo[];
	
	    static createFrom(source: any = {}) {
	        return new AgentResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.message = source["message"];
	        this.toolCalls = this.convertValues(source["toolCalls"], ToolCallInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Session {
	    id: string;
	    title: string;
	    createdAt: string;
	
	    static createFrom(source: any = {}) {
	        return new Session(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.createdAt = source["createdAt"];
	    }
	}
	export class Settings {
	    notifications: boolean;
	    modelMode: string;
	    theme: string;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.notifications = source["notifications"];
	        this.modelMode = source["modelMode"];
	        this.theme = source["theme"];
	    }
	}

}

