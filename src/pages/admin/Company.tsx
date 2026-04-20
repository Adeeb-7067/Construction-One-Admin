import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { PageHeader } from "@/components/shared/PageHeader";
import { useGetCompanyQuery, useUpdateCompanyMutation } from "../Redux/apiSlice";
import { 
  Loader2, Save, Upload, Plus, Trash2, Globe, Building2, 
  ShieldCheck, Palette, Layout, Settings, Truck, Facebook, 
  Instagram, Linkedin, Twitter, Youtube, MessageCircle, Pin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

export default function Company() {
  const { data: response, isLoading: isFetching } = useGetCompanyQuery(undefined);
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const form = useForm({
    defaultValues: {
      siteName: "",
      description: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      gstNumber: "",
      taxPercentage: 18,
      playStoreLink: "",
      appStoreLink: "",
      delivery: {
        productDeliveryFee: 0,
        minDeliveryAmount: 0,
        adminCharge: 0
      },
      theme: {
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
        fontFamily: "Arial",
        borderRadius: 8
      },
      socialMedia: {
        facebook: "",
        instagram: "",
        linkedin: "",
        twitter: "",
        youtube: "",
        whatsapp: "",
        pinterest: "",
        googleMyBusiness: ""
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [] as string[]
      },
      policy: {
        refundPolicy: "",
        shippingPolicy: "",
        returnPolicy: "",
        privacyPolicy: "",
        termsAndConditions: ""
      },
      onboardingScreens: [] as any[]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "onboardingScreens"
  });

  useEffect(() => {
    if (response?.data?.company) {
      const company = response.data.company;
      form.reset({
        ...company,
        seo: {
          ...company.seo,
          keywords: company.seo?.keywords || []
        }
      });
      
      // Set initial previews
      const initialPreviews: any = {};
      if (company.headerLogo) initialPreviews.headerLogo = company.headerLogo;
      if (company.footerLogo) initialPreviews.footerLogo = company.footerLogo;
      if (company.banner) initialPreviews.banner = company.banner;
      if (company.favicon) initialPreviews.favicon = company.favicon;
      if (company.loader) initialPreviews.loader = company.loader;
      if (company.signatory) initialPreviews.signatory = company.signatory;
      
      company.onboardingScreens?.forEach((screen: any, index: number) => {
        if (screen.image) initialPreviews[`onboardingScreens.${index}.image`] = screen.image;
      });
      
      setPreviews(initialPreviews);
    }
  }, [response, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(name as any, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [name]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    
    const appendValue = (key: string, value: any) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null && !(item instanceof File)) {
            Object.keys(item).forEach(childKey => {
              appendValue(`${key}[${index}][${childKey}]`, item[childKey]);
            });
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        Object.keys(value).forEach(childKey => {
          appendValue(`${key}[${childKey}]`, value[childKey]);
        });
      } else {
        formData.append(key, value !== undefined && value !== null ? value : "");
      }
    };

    Object.keys(values).forEach(key => {
      appendValue(key, values[key]);
    });

    try {
      await updateCompany(formData).unwrap();
      toast.success("Company settings updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update company settings");
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Company Settings" 
        description="Global configuration for brand identity, logistics, and legal policies"
        actions={
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isUpdating} className="rounded-xl shadow-lg shadow-primary/20 gap-2">
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Changes
          </Button>
        }
      />

      <Form {...form}>
        <form className="space-y-8">
          {/* 1. General Info */}
          <Section title="General Information" icon={<Building2 className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl><Input placeholder="ConstructionHub" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl><Input placeholder="22AAAAA0000A1Z5" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input placeholder="info@company.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone</FormLabel>
                      <FormControl><Input placeholder="9876543210" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alternatePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Phone</FormLabel>
                      <FormControl><Input placeholder="9999999999" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl><Textarea placeholder="Brief summary of your company..." className="min-h-[100px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl><Textarea placeholder="Headquarters location..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Section>

          {/* 2. Visual Identity */}
          <Section title="Visual Identity & Branding" icon={<Palette className="h-5 w-5" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <ImageUploadField label="Header Logo" name="headerLogo" preview={previews.headerLogo} onChange={(e) => handleFileChange(e, "headerLogo")} />
              <ImageUploadField label="Footer Logo" name="footerLogo" preview={previews.footerLogo} onChange={(e) => handleFileChange(e, "footerLogo")} />
              <ImageUploadField label="Favicon" name="favicon" preview={previews.favicon} onChange={(e) => handleFileChange(e, "favicon")} aspect="square" />
              <ImageUploadField label="Main Banner" name="banner" preview={previews.banner} onChange={(e) => handleFileChange(e, "banner")} />
              <ImageUploadField label="Site Loader" name="loader" preview={previews.loader} onChange={(e) => handleFileChange(e, "loader")} aspect="square" />
              <ImageUploadField label="Digital Signatory" name="signatory" preview={previews.signatory} onChange={(e) => handleFileChange(e, "signatory")} />
            </div>
            
            <Separator className="my-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="theme.primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <div className="flex gap-2">
                        <Input type="color" className="p-1 h-10 w-20" {...field} />
                        <Input {...field} />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme.secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <div className="flex gap-2">
                        <Input type="color" className="p-1 h-10 w-20" {...field} />
                        <Input {...field} />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="theme.fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Family</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme.borderRadius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Border Radius (px)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Section>

          {/* 3. Logistics & Taxes */}
          <Section title="Logistics & Financials" icon={<Truck className="h-5 w-5" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField control={form.control} name="taxPercentage" render={({ field }) => (
                <FormItem><FormLabel>Tax Percentage (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="delivery.productDeliveryFee" render={({ field }) => (
                <FormItem><FormLabel>Base Delivery Fee</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="delivery.minDeliveryAmount" render={({ field }) => (
                <FormItem><FormLabel>Min. Amount for Delivery</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="delivery.adminCharge" render={({ field }) => (
                <FormItem><FormLabel>Platform Service Charge</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
              )} />
            </div>
          </Section>

          {/* 4. Onboarding Screens */}
          <Section title="Onboarding Screens" icon={<Layout className="h-5 w-5" />}>
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="relative p-6 rounded-3xl border bg-muted/20 space-y-4">
                  <Button variant="ghost" size="icon" onClick={() => remove(index)} className="absolute top-4 right-4 text-destructive hover:bg-destructive/10 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <ImageUploadField 
                        label={`Screen ${index + 1} Image`} 
                        name={`onboardingScreens.${index}.image`} 
                        preview={previews[`onboardingScreens.${index}.image`]} 
                        onChange={(e) => handleFileChange(e, `onboardingScreens.${index}.image`)} 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <FormField control={form.control} name={`onboardingScreens.${index}.title`} render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`onboardingScreens.${index}.subtitle`} render={({ field }) => (
                        <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`onboardingScreens.${index}.color`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background Color</FormLabel>
                          <div className="flex gap-2">
                            <Input type="color" className="p-1 h-10 w-20" {...field} />
                            <Input {...field} />
                          </div>
                        </FormItem>
                      )} />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => append({ title: "", subtitle: "", color: "#ffffff", image: "" })} className="w-full h-16 border-dashed rounded-3xl gap-2 hover:bg-primary/5 transition-colors">
                <Plus className="h-5 w-5" /> Add Onboarding Screen
              </Button>
            </div>
          </Section>

          {/* 5. SEO & Social */}
          <Section title="SEO & Support Presence" icon={<Globe className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Globe className="h-3 w-3" /> Search Engine Optimization
                </h4>
                <FormField control={form.control} name="seo.metaTitle" render={({ field }) => (
                  <FormItem><FormLabel>Meta Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="seo.metaDescription" render={({ field }) => (
                  <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Settings className="h-3 w-3" /> External Store Links
                </h4>
                <FormField control={form.control} name="playStoreLink" render={({ field }) => (
                  <FormItem><FormLabel>Google Play Store Link</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="appStoreLink" render={({ field }) => (
                  <FormItem><FormLabel>Apple App Store Link</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SocialField name="socialMedia.facebook" icon={<Facebook />} label="Facebook" control={form.control} />
              <SocialField name="socialMedia.instagram" icon={<Instagram />} label="Instagram" control={form.control} />
              <SocialField name="socialMedia.linkedin" icon={<Linkedin />} label="LinkedIn" control={form.control} />
              <SocialField name="socialMedia.twitter" icon={<Twitter />} label="Twitter" control={form.control} />
              <SocialField name="socialMedia.youtube" icon={<Youtube />} label="YouTube" control={form.control} />
              <SocialField name="socialMedia.whatsapp" icon={<MessageCircle />} label="WhatsApp" control={form.control} />
              <SocialField name="socialMedia.pinterest" icon={<Pin />} label="Pinterest" control={form.control} />
              <SocialField name="socialMedia.googleMyBusiness" icon={<Globe />} label="Google Business" control={form.control} />
            </div>
          </Section>

          {/* 6. Policies */}
          <Section title="Legal Policies" icon={<ShieldCheck className="h-5 w-5" />}>
            <div className="grid grid-cols-1 gap-8">
              <PolicyField name="policy.privacyPolicy" label="Privacy Policy" control={form.control} />
              <PolicyField name="policy.termsAndConditions" label="Terms & Conditions" control={form.control} />
              <PolicyField name="policy.refundPolicy" label="Refund Policy" control={form.control} />
              <PolicyField name="policy.shippingPolicy" label="Shipping Policy" control={form.control} />
              <PolicyField name="policy.returnPolicy" label="Return Policy" control={form.control} />
            </div>
          </Section>
        </form>
      </Form>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[40px] border bg-card p-8 shadow-sm space-y-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-black tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ImageUploadField({ label, name, preview, onChange, aspect = "video" }: any) {
  return (
    <div className="space-y-3">
      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</FormLabel>
      <div className={`relative group w-full rounded-3xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 flex items-center justify-center overflow-hidden bg-muted/30 transition-all ${aspect === "square" ? "aspect-square" : "aspect-video"}`}>
        {preview ? (
          <img src={preview} alt={label} className="h-full w-full object-contain p-2" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-6 w-6" />
            <span className="text-[10px] font-bold">CLICK TO UPLOAD</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" size="sm" className="rounded-full font-bold text-[10px]">CHANGE IMAGE</Button>
        </div>
        <input type="file" accept="image/*" onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>
    </div>
  );
}

function SocialField({ name, icon, label, control }: any) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <span className="text-primary">{icon}</span> {label}
          </FormLabel>
          <FormControl><Input placeholder="Username or link" {...field} /></FormControl>
        </FormItem>
      )}
    />
  );
}

function PolicyField({ name, label, control }: any) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-bold">{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={`Detail your company's ${label.toLowerCase()}...`} className="min-h-[200px] leading-relaxed" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
