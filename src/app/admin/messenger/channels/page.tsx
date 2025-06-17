//src/pages/messenger/channels.tsx

'use client';

import * as React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { PlusCircle, Radio, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';

type WizardStep = 'selection' | 'configure';

export default function MessengerChannelsPage() {
  const { t } = useLocale();
  const { toast } = useToast();

  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<WizardStep>('selection');
  
  // Form data
  const [channelName, setChannelName] = React.useState<string>('');
  const [platform, setPlatform] = React.useState<string>('');
  const [integration, setIntegration] = React.useState<string>('');

  // Credentials
  const [token, setToken] = React.useState('');
  const [phoneNumberId, setPhoneNumberId] = React.useState('');
  const [appId, setAppId] = React.useState('');

  // Reset form when dialog closes
  const resetForm = () => {
    setCurrentStep('selection');
    setChannelName('');
    setPlatform('');
    setIntegration('');
    setToken('');
    setPhoneNumberId('');
    setAppId('');
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const handleNext = () => {
    if (currentStep === 'selection') {
      setCurrentStep('configure');
    }
  };

  const handleBack = () => {
    if (currentStep === 'configure') {
      setCurrentStep('selection');
      // Reset integration when going back
      setIntegration('');
    }
  };

  const handleSave = () => {
    toast({
      title: 'Channel saved (Mock)',
      description: `${channelName} channel configured successfully!`,
    });
    setOpen(false);
    resetForm();
  };

  const platformOptions = ['WhatsApp', 'Telegram', 'Instagram Messenger', 'Facebook Messenger'];
  
  const getIntegrationOptions = () => {
    switch (platform) {
      case 'WhatsApp':
        return ['QR Code', 'Cloud API'];
      case 'Telegram':
        return ['Bot API'];
      case 'Instagram Messenger':
      case 'Facebook Messenger':
        return ['Meta API'];
      default:
        return [];
    }
  };

  const canProceedToNext = () => {
    return channelName.trim() !== '' && platform !== '' && integration !== '';
  };

  const canSave = () => {
    if (!integration) return false;
    
    // QR Code integration doesn't need additional validation
    if (integration === 'QR Code') return true;
    
    // Validate required fields based on integration type
    if (platform === 'WhatsApp' && integration === 'Cloud API') {
      return token.trim() !== '' && phoneNumberId.trim() !== '';
    }
    
    if (platform === 'Telegram') {
      return token.trim() !== '';
    }
    
    if (platform === 'Instagram Messenger' || platform === 'Facebook Messenger') {
      return token.trim() !== '';
    }
    
    return false;
  };

  const getIntegrationDescription = () => {
    if (platform === 'WhatsApp' && integration === 'Cloud API') {
      return (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">✅ Meta-approved.</p>
          <p className="text-xs text-muted-foreground">✅ Reliable.</p>
          <p className="text-xs text-muted-foreground">✅ No Risk of number ban.</p>
          <p className="text-xs text-muted-foreground">💵 Pay Meta directly (first 1,000 chats/month free).</p>
        </div>
      );
    }
    
    if (platform === 'WhatsApp' && integration === 'QR Code') {
      return (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">✅ No costs.</p>
          <p className="text-xs text-muted-foreground">✅ Simple QR login.</p>
          <p className="text-xs text-muted-foreground">❌ Risk of account bans.</p>
          <p className="text-xs text-muted-foreground">❌ Requires frequent qr-code scanning for authenticating verification.</p>
        </div>
      );
    }

    if (platform === 'Telegram' && integration === 'Bot API') {
      return (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">✅ Free to use.</p>
          <p className="text-xs text-muted-foreground">✅ Easy setup with BotFather.</p>
          <p className="text-xs text-muted-foreground">✅ Reliable and stable.</p>
          <p className="text-xs text-muted-foreground">📱 Perfect for customer support and automation.</p>
        </div>
      );
    }

    if (platform === 'Facebook Messenger' && integration === 'Meta API') {
      return (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">✅ Official Meta integration.</p>
          <p className="text-xs text-muted-foreground">✅ Rich messaging features.</p>
          <p className="text-xs text-muted-foreground">✅ Large user base reach.</p>
          <p className="text-xs text-muted-foreground">⚙️ Requires Facebook App setup.</p>
        </div>
      );
    }

    if (platform === 'Instagram Messenger' && integration === 'Meta API') {
      return (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">✅ Official Meta integration.</p>
          <p className="text-xs text-muted-foreground">✅ Visual-first messaging.</p>
          <p className="text-xs text-muted-foreground">✅ Young demographic reach.</p>
          <p className="text-xs text-muted-foreground">⚙️ Requires Instagram Business account.</p>
        </div>
      );
    }
    
    // Default description for any other platforms
    return (
      <p className="text-xs text-muted-foreground">
        You'll configure the connection details in the next step.
      </p>
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium ${
          currentStep === 'selection' 
            ? 'bg-primary text-primary-foreground border-primary' 
            : 'bg-primary text-primary-foreground border-primary'
        }`}>
          1
        </div>
        <div className={`w-12 h-0.5 ${
          currentStep === 'configure' ? 'bg-primary' : 'bg-muted'
        }`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium ${
          currentStep === 'configure' 
            ? 'bg-primary text-primary-foreground border-primary' 
            : 'bg-muted text-muted-foreground border-muted'
        }`}>
          2
        </div>
      </div>
    </div>
  );

  const renderSelectionStep = () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Channel Name *</Label>
        <Input
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="e.g., Support WhatsApp, Customer Service Bot"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Platform *</Label>
        <Select
          value={platform}
          onValueChange={(v) => {
            setPlatform(v);
            // Reset integration when platform changes
            setIntegration('');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a messaging platform" />
          </SelectTrigger>
          <SelectContent>
            {platformOptions.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {platform && (
        <div className="flex flex-col gap-2">
          <Label>Integration Type *</Label>
          <Select value={integration} onValueChange={setIntegration}>
            <SelectTrigger>
              <SelectValue placeholder="Select integration method" />
            </SelectTrigger>
            <SelectContent>
              {getIntegrationOptions().map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {platform && integration && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Selected:</strong> {platform} - {integration}
          </p>
          <div className="mt-1">
            {getIntegrationDescription()}
          </div>
        </div>
      )}
    </div>
  );

  const renderQRCodeStep = () => (
    <div className="flex flex-col items-center gap-6">
      <div className="p-3 bg-muted/30 rounded-lg w-full">
        <p className="text-sm font-medium">{channelName}</p>
        <p className="text-xs text-muted-foreground">{platform} - {integration}</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-48 h-48 bg-white border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-black/10 rounded-lg mb-2 mx-auto flex items-center justify-center">
              <div className="text-4xl">📱</div>
            </div>
            <p className="text-xs text-muted-foreground">QR Code will appear here</p>
          </div>
        </div>
        
        <div className="text-center max-w-sm">
          <h4 className="font-medium text-sm mb-2">Scan with WhatsApp</h4>
          <p className="text-xs text-muted-foreground">
            Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device, 
            and scan the QR code above.
          </p>
        </div>
      </div>

      <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> QR code generation and scanning functionality is pending backend implementation.
        </p>
      </div>
    </div>
  );

  const renderCredentialsFields = () => {
    if (platform === 'WhatsApp' && integration === 'Cloud API') {
      return (
        <>
          <div className="flex flex-col gap-2">
            <Label>Access Token *</Label>
            <Input 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
              placeholder="Enter your WhatsApp Cloud API access token" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Phone Number ID *</Label>
            <Input 
              value={phoneNumberId} 
              onChange={(e) => setPhoneNumberId(e.target.value)} 
              placeholder="Enter your Phone Number ID" 
            />
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Get your credentials:</strong> Go to Meta Developer Console → WhatsApp → API Setup to get your access token and phone number ID.
            </p>
          </div>
        </>
      );
    }

    if (platform === 'Telegram') {
      return (
        <>
          <div className="flex flex-col gap-2">
            <Label>Bot Token *</Label>
            <Input 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
              placeholder="Enter your Telegram bot token" 
            />
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>How to get your bot token:</strong>
            </p>
            <ol className="text-xs text-blue-700 mt-1 ml-4 list-decimal space-y-1">
              <li>Message @BotFather on Telegram</li>
              <li>Send /newbot and follow the instructions</li>
              <li>Copy the token provided by BotFather</li>
            </ol>
          </div>
        </>
      );
    }

    if (platform === 'Facebook Messenger') {
      return (
        <>
          <div className="flex flex-col gap-2">
            <Label>Page Access Token *</Label>
            <Input 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
              placeholder="Enter your Facebook page access token" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>App ID (Optional)</Label>
            <Input 
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="Enter your Facebook app ID" 
            />
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Setup requirements:</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-1 ml-4 list-disc space-y-1">
              <li>Create a Facebook App in Meta Developer Console</li>
              <li>Add Messenger product to your app</li>
              <li>Generate a page access token for your Facebook page</li>
              <li>Set up webhook for receiving messages</li>
            </ul>
          </div>
        </>
      );
    }

    if (platform === 'Instagram Messenger') {
      return (
        <>
          <div className="flex flex-col gap-2">
            <Label>Page Access Token *</Label>
            <Input 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
              placeholder="Enter your Instagram page access token" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>App ID (Optional)</Label>
            <Input 
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="Enter your Instagram app ID" 
            />
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Setup requirements:</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-1 ml-4 list-disc space-y-1">
              <li>Convert personal Instagram account to Business/Creator</li>
              <li>Connect Instagram account to a Facebook page</li>
              <li>Create Facebook App with Instagram Basic Display</li>
              <li>Generate access token through Meta Developer Console</li>
            </ul>
          </div>
        </>
      );
    }

    return null;
  };

  const renderConfigureStep = () => {
    // Show QR Code interface for QR Code integration
    if (integration === 'QR Code') {
      return renderQRCodeStep();
    }

    // Show credential collection for API integrations
    return (
      <div className="flex flex-col gap-4">
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium">{channelName}</p>
          <p className="text-xs text-muted-foreground">{platform} - {integration}</p>
        </div>

        <div className="flex flex-col gap-4">
          {renderCredentialsFields()}
        </div>
      </div>
    );
  };

  const getDialogTitle = () => {
    switch (currentStep) {
      case 'selection':
        return 'Add New Channel - Selection';
      case 'configure':
        return 'Add New Channel - Configuration';
      default:
        return 'Add New Channel';
    }
  };

  const getDialogDescription = () => {
    switch (currentStep) {
      case 'selection':
        return 'Choose a name, platform, and integration method for your new messaging channel.';
      case 'configure':
        if (integration === 'QR Code') {
          return 'Scan the QR code with your WhatsApp to complete the connection.';
        }
        return 'Configure the connection details for your selected platform.';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Radio className="h-3 w-3 text-primary" />
          {t('sidebar.messenger_channels', 'Messenger Channels')}
        </h1>

        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-3 w-3" />
              {t('messenger_channels.add_channel_button', 'Add Channel')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{getDialogTitle()}</DialogTitle>
              <DialogDescription>{getDialogDescription()}</DialogDescription>
            </DialogHeader>

            {renderStepIndicator()}

            <div className="min-h-[300px]">
              {currentStep === 'selection' && renderSelectionStep()}
              {currentStep === 'configure' && renderConfigureStep()}
            </div>

            <DialogFooter className="gap-2">
              {currentStep === 'configure' && (
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              
              {currentStep === 'selection' ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!canProceedToNext()}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave}
                  disabled={!canSave()}
                  className={integration === 'QR Code' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {integration === 'QR Code' ? 'Complete' : 'Save Channel'}
                </Button>
              )}
              
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Messenger Channels</CardTitle>
          <CardDescription className="text-xs">
            Your configured channels will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            No channels added yet. (Database integration pending.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}