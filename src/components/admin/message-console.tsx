"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendGift } from '@/lib/actions';
import { USER_N_ID, USER_K_ID } from '@/lib/constants';
import { Send, User, Users } from 'lucide-react';

type TargetUser = typeof USER_N_ID | typeof USER_K_ID | 'both';

export function MessageConsole() {
  const [message, setMessage] = useState('');
  const [targetUser, setTargetUser] = useState<TargetUser>('both');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) {
      toast({ title: 'Error', description: 'Message cannot be empty.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    let targetUserIds: string[] = [];
    if (targetUser === USER_N_ID) targetUserIds = [USER_N_ID];
    else if (targetUser === USER_K_ID) targetUserIds = [USER_K_ID];
    else targetUserIds = [USER_N_ID, USER_K_ID];
    
    const result = await sendGift(targetUserIds, message);

    if (result.success) {
      toast({ title: 'Gift Sent!', description: result.message });
      setMessage(''); // Clear message after sending
    } else {
      toast({
        title: 'Failed to Send Gift',
        description: result.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Admin Gift Console</CardTitle>
        <CardDescription>Send a motivational message or a surprise to your users!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="message" className="text-lg">Gift Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your encouraging message here..."
              required
              rows={5}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Select Recipient(s)</Label>
            <RadioGroup
              value={targetUser}
              onValueChange={(value: TargetUser) => setTargetUser(value)}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer flex-1">
                <RadioGroupItem value={USER_N_ID} id="user_n" />
                <Label htmlFor="user_n" className="text-base flex items-center gap-2 cursor-pointer w-full"> <User size={18}/> User N</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer flex-1">
                <RadioGroupItem value={USER_K_ID} id="user_k" />
                <Label htmlFor="user_k" className="text-base flex items-center gap-2 cursor-pointer w-full"> <User size={18}/> User K</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer flex-1">
                <RadioGroupItem value="both" id="both_users" />
                <Label htmlFor="both_users" className="text-base flex items-center gap-2 cursor-pointer w-full"> <Users size={18}/> Both Users</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
            {isLoading ? (
              <Send className="mr-2 h-5 w-5 animate-pulse" />
            ) : (
              <Send className="mr-2 h-5 w-5" />
            )}
            Send Gift
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
