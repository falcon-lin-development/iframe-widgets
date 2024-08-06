export enum ProfileWidgetTypes {
  MootiezBrandingWidget = 'mootiez-branding-widget',
  AvatarWidget = 'avatar-widget',
  UserNameWidget = 'user-name-widget',
  BioWidget = 'bio-widget',
  AttributeWidget = 'attribute-widget',
  AttributesWidget = 'attributes-widget',
  LinksWidget = 'links-widget',
}

export enum ItemLayoutZIndex {
  archived = -100,
  bg = 0,
  content = 100,
  static = 9999, //
}
export type BaseProfileWidgetType = {
  id: string;
  type: ProfileWidgetTypes;
  layout: {
    x: number;
    y: number;
    z: number; // z: -100 archived, 0 bg, 100 content, 101 static,
    w: number;
    h: number;
  };
  attributes?: {
    style_classes?: string[];
  };
};
export type MootiezBrandingWidgetType = BaseProfileWidgetType & {
  type: ProfileWidgetTypes.MootiezBrandingWidget;
  layout: {
    w: 4;
    h: 1;
  };
};
export type AvatarWidgetType = BaseProfileWidgetType & {
  type: ProfileWidgetTypes.AvatarWidget;
  layout: {
    w: 1 | 2 | 4 | 6;
    h: 1 | 2 | 4 | 6;
  };
};

export type UserNameWidgetType = BaseProfileWidgetType & {
  type: ProfileWidgetTypes.UserNameWidget;
  layout: {
    w: 4;
    h: 1;
  };
};

export type BioWidgetType = BaseProfileWidgetType & {
  type: ProfileWidgetTypes.BioWidget;
  layout: {
    w: 6;
    h: 1 | 2;
  };
};

export type AttributesWidgetType = BaseProfileWidgetType & {
  type: ProfileWidgetTypes.AttributesWidget;
  layout: {
    w: 6;
    h: 1;
  };
  attributes: {
    attributes: {
      badgeMetadata: {
        community_id: string;
        cta: string;
        display_name: string;
        free_claim: boolean;
        img_url: string;
        point_id: string;
        thumbnail_url: string;
      };
      balance: number;
      communityId: string;
      personaId: string;
      pointId: string;
      style_classes: string[];
    }[];
  };
};

export type AttributeWidgetType = BaseProfileWidgetType & {
  type: ProfileWidgetTypes.AttributeWidget;
  layout: {
    w: 1;
    h: 1;
  };
  attributes?: {
    badgeMetadata: {
      community_id: string;
      cta: string;
      display_name: string;
      free_claim: boolean;
      img_url: string;
      point_id: string;
      thumbnail_url: string;
    };
    balance: number;
    communityId: string;
    personaId: string;
    pointId: string;
    style_classes: string[];
  };
};

export type LinksWidgetType = BaseProfileWidgetType & {
  type: ProfileWidgetTypes.LinksWidget;
  layout: {
    w: 6;
    h: 1;
  };
  attributes: {
    links: {
      id?: string;
      icon?: string;
      title?: string;
      tracking_url: string;
      url: string;
      style_classes?: string[];
    }[];
  };
};
